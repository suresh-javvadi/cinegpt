import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import lang from "../../utils/languagesConstants";
import { API_GET_OPTIONS } from "../../utils/constants";
import { addGptMovieResult } from "../../slices/gptSlice";

const EXAMPLE_PROMPTS = [
  "Movies like RRR",
  "Movies like Interstellar",
  "Best Tollywood blockbusters",
  "Psychological thrillers from the 90s",
  "South Indian mass action movies",
  "Romantic films that make you cry",
  "Movies like Baahubali",
  "Movies with shocking plot twists",
  "Best Bollywood thrillers",
  "Feel-good comedies for a lazy evening",
  "Telugu family drama movies",
  "Underrated Korean movies",
  "Horror that isn't just jump scares",
  "Animated films for adults",
];

const STAGE_LABELS = {
  asking:    "Asking Groq AI for recommendations...",
  verifying: "Verifying movie titles...",
  fetching:  "Finding movies on TMDB...",
};

const RECENT_KEY = "cinegpt_recent_searches";
const CACHE_KEY  = "cinegpt_results_cache";

const getResultsCache = () => {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) ?? "{}"); }
  catch { return {}; }
};

const setResultsCache = (normalizedQuery, data) => {
  const cache = getResultsCache();
  cache[normalizedQuery] = data;
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
};

const GptSearchBar = () => {
  const dispatch = useDispatch();
  const selectedLang = useSelector((store) => store.config.lang);
  const searchTerm = useRef(null);
  const [loadingStage, setLoadingStage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [recentSearches, setRecentSearches] = useState(() => {
    try { return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]"); }
    catch { return []; }
  });

  const isLoading = loadingStage !== null;

  const saveRecent = (query) => {
    const updated = [query, ...recentSearches.filter((q) => q !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  };

  const removeRecent = (e, query) => {
    e.stopPropagation();
    const updated = recentSearches.filter((q) => q !== query);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  };

  const fetchMovie = async (title, year) => {
    const search = async (q) => {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(q)}&include_adult=false&page=1`,
        API_GET_OPTIONS,
      );
      const json = await res.json();
      return json.results ?? [];
    };

    let results = await search(title);

    // Fallback: drop subtitle — "Pushpa: The Rise - Part 1" → "Pushpa"
    if (!results.length) {
      const rootTitle = title.split(/\s*[:\-–]\s*/)[0].trim();
      if (rootTitle !== title) results = await search(rootTitle);
    }

    // Year filter: keep only results within ±1 year so "Kushi (2001)" doesn't mix with the 2023 remake
    if (year && results.length) {
      const yearMatched = results.filter((m) => {
        const y = parseInt(m.release_date?.slice(0, 4));
        return Math.abs(y - year) <= 1;
      });
      if (yearMatched.length) results = yearMatched;
    }

    // Most-voted version first so the canonical movie leads
    return results.sort((a, b) => (b.vote_count ?? 0) - (a.vote_count ?? 0));
  };

  // Parse "Kushi (2001)" → { label: "Kushi (2001)", title: "Kushi", year: 2001 }
  // Also handles "1. Kushi (2001)", "- Kushi (2001)", "* Kushi (2001)" formats
  const parseEntry = (raw) => {
    const cleaned = raw
      .trim()
      .replace(/^\d+[\.\)]\s*/, "") // strip "1. " or "1) "
      .replace(/^[-*•]\s*/, "")     // strip "- " or "* " or "• "
      .trim();
    if (!cleaned || cleaned.length < 2) return { label: "", title: "", year: null };
    const m = cleaned.match(/^(.+?)\s*\((\d{4})\)\s*$/);
    if (m) return { label: cleaned, title: m[1].trim(), year: parseInt(m[2]) };
    return { label: cleaned, title: cleaned, year: null };
  };

  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`;
  const today = new Date().toISOString().slice(0, 10); // e.g. "2026-06-13"
  const SYSTEM_PROMPT = `You are a precise movie recommendation engine covering all world cinema — Hollywood, Bollywood, Tollywood, Tamil, Malayalam, Kannada, Korean, Japanese, and more. Accuracy and formatting are critical. Today's date is ${today}. When the user's query implies recency (e.g. "this weekend", "latest", "new releases", "now playing", "2025 movies"), prioritize movies released in the last 6–12 months.`;

  const callGemini = async (contents) => {
    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 512,
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      if (res.status === 429) {
        const quotaErr = new Error("Gemini quota exceeded — switching to backup AI.");
        quotaErr.isQuota = true;
        throw quotaErr;
      }
      throw new Error(err?.error?.message ?? `Gemini request failed (${res.status})`);
    }
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!text) throw new Error("Gemini returned an empty response. Try rephrasing your query.");
    return text;
  };

  const callGroq = async (messages) => {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages,
        temperature: 0.3,
        max_tokens: 512,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      if (res.status === 429) {
        const quotaErr = new Error("Groq quota exceeded — switching to backup AI.");
        quotaErr.isQuota = true;
        throw quotaErr;
      }
      throw new Error(err?.error?.message ?? `Groq request failed (${res.status})`);
    }
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error("AI returned an empty response. Try rephrasing your query.");
    return text;
  };

  // Try Groq first; silently fall back to Gemini on quota error
  const callAI = async (geminiContents, groqMessages) => {
    try {
      return await callGroq(groqMessages);
    } catch (err) {
      if (err.isQuota) return await callGemini(geminiContents);
      throw err;
    }
  };

  const RULES = `Rules:\n- If the query implies recency ("this weekend", "latest", "new", "now playing", "2025"), ONLY recommend movies released in the last 6–12 months\n- Include movies from ANY language or country; if the query mentions a regional language or industry (Telugu, Tamil, Hindi, etc.), prioritize those films\n- Provide titles ONLY in their romanized/English form as they appear in TMDB or IMDb — no native scripts\n- Include the release year in parentheses after each title, e.g.: Kushi (2001), RRR (2022)\n- Exactly 5 movies\n- No numbering\n- No explanations\n- Comma-separated\n- Single line`;
  const VERIFY = `Check your previous answer carefully. Fix any mistakes. Ensure:\n- Exactly 5 real movie titles\n- Each title includes the release year in parentheses, e.g.: Kushi (2001), RRR (2022)\n- Titles are in romanized/English form exactly as they appear in TMDB or IMDb (no native scripts)\n- Correct spelling and correct year\n- No duplicates\n- Comma-separated\n- Single line only\nReturn ONLY the corrected movie list.`;

  const handleGptSearch = async (overrideQuery) => {
    const query = overrideQuery ?? searchTerm.current?.value.trim();
    if (!query) return;

    setErrorMsg(null);

    // Serve from cache if available — no AI call needed
    const cacheKey = query.toLowerCase().trim();
    const cached = getResultsCache()[cacheKey];
    if (cached) {
      dispatch(addGptMovieResult(cached));
      saveRecent(query);
      if (searchTerm.current) searchTerm.current.value = "";
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 1500);
      return;
    }

    setLoadingStage("asking");
    setIsSuccess(false);

    try {
      // Stage 1 — ask AI (Gemini → Groq fallback)
      const askMsg = `Recommend movies based on this query:\n"${query}"\n${RULES}`;
      const firstResponse = await callAI(
        [{ role: "user", parts: [{ text: askMsg }] }],
        [{ role: "system", content: SYSTEM_PROMPT }, { role: "user", content: askMsg }],
      );

      // Stage 2 — verify (same provider chain)
      setLoadingStage("verifying");
      const finalContent = await callAI(
        [
          { role: "user",  parts: [{ text: `Recommend movies based on: "${query}"` }] },
          { role: "model", parts: [{ text: firstResponse }] },
          { role: "user",  parts: [{ text: VERIFY }] },
        ],
        [
          { role: "system",    content: SYSTEM_PROMPT },
          { role: "user",      content: `Recommend movies based on: "${query}"` },
          { role: "assistant", content: firstResponse },
          { role: "user",      content: VERIFY },
        ],
      );

      if (!finalContent) throw new Error("AI returned an empty verification response.");

      // Split on comma OR newline — Gemini sometimes ignores the "comma-separated" instruction
      const parsed = finalContent
        .split(/[\n,]+/)
        .map(parseEntry)
        .filter((p) => p.title && p.title.length > 1)
        .slice(0, 5);

      // Stage 3 — fetch from TMDB
      setLoadingStage("fetching");

      const movieResults = await Promise.all(parsed.map((p) => fetchMovie(p.title, p.year)));

      const result = { movieNames: parsed.map((p) => p.label), movieResults, query };
      setResultsCache(cacheKey, result);
      dispatch(addGptMovieResult(result));
      saveRecent(query);
      if (searchTerm.current) searchTerm.current.value = "";
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 1500);
    } catch (err) {
      console.error("GPT Search Error:", err);
      setErrorMsg(err.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoadingStage(null);
    }
  };

  const handleChipClick = (prompt) => {
    if (searchTerm.current) searchTerm.current.value = prompt;
    handleGptSearch(prompt);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Search form */}
      <form
        className="w-full max-w-xl sm:max-w-2xl flex gap-2 p-2 bg-white/10 backdrop-blur-md border border-white/15 rounded-xl"
        onSubmit={(e) => { e.preventDefault(); handleGptSearch(); }}
      >
        <input
          ref={searchTerm}
          type="text"
          placeholder={lang[selectedLang]?.gptSearchPlaceHolder ?? "Try 'movies like Interstellar'..."}
          className="flex-1 min-w-0 px-4 py-3 bg-transparent text-white placeholder-gray-500 text-sm sm:text-base focus:outline-none"
        />

        <button
          type="submit"
          disabled={isLoading}
          className={`
            flex-shrink-0 flex items-center justify-center gap-2
            px-4 sm:px-6 py-3 rounded-lg font-semibold text-sm sm:text-base
            transition-all duration-300
            ${isLoading
              ? "bg-purple-900 cursor-not-allowed w-12"
              : isSuccess
              ? "bg-green-600 px-5 cursor-default"
              : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white cursor-pointer"
            }
          `}
        >
          {isLoading ? (
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isSuccess ? (
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
              </svg>
              <span>{lang[selectedLang]?.search ?? "Search"}</span>
            </>
          )}
        </button>
      </form>

      {/* Error banner — #6 */}
      {errorMsg && (
        <div className="w-full max-w-xl sm:max-w-2xl flex items-start gap-3 bg-red-950/60 border border-red-500/40 text-red-300 text-sm rounded-xl px-4 py-3">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="flex-shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
          </svg>
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="ml-auto text-red-400 hover:text-red-200 cursor-pointer">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Loading stage indicator — #7 */}
      {isLoading && (
        <div className="flex items-center gap-3 text-sm text-gray-300">
          <div className="h-4 w-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
          <span>{STAGE_LABELS[loadingStage]}</span>
        </div>
      )}

      {/* Recent searches — hidden while loading */}
      {!isLoading && recentSearches.length > 0 && (
        <div className="w-full max-w-xl sm:max-w-2xl">
          <p className="text-gray-500 text-xs text-center mb-3 uppercase tracking-widest">
            Recent
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {recentSearches.map((query) => (
              <button
                key={query}
                onClick={() => handleChipClick(query)}
                className="
                  flex items-center gap-1.5
                  pl-3 pr-2 py-1.5
                  bg-white/8 hover:bg-white/15
                  border border-white/15 hover:border-white/30
                  text-gray-300 hover:text-white
                  text-xs sm:text-sm rounded-full
                  transition-all duration-200 cursor-pointer
                  backdrop-blur-sm
                "
              >
                <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-400 flex-shrink-0">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{query}</span>
                <span
                  role="button"
                  onClick={(e) => removeRecent(e, query)}
                  className="ml-0.5 p-0.5 text-gray-500 hover:text-gray-200 rounded-full transition-colors cursor-pointer"
                >
                  <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Example prompt chips — hidden while loading */}
      {!isLoading && (
        <div className="w-full max-w-xl sm:max-w-2xl">
          <p className="text-gray-500 text-xs text-center mb-3 uppercase tracking-widest">
            Try one of these
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {EXAMPLE_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleChipClick(prompt)}
                className="
                  flex items-center gap-1.5
                  px-3 py-1.5
                  bg-white/5 hover:bg-white/15
                  border border-white/10 hover:border-purple-400/50
                  text-gray-300 hover:text-white
                  text-xs sm:text-sm rounded-full
                  transition-all duration-200 cursor-pointer
                  backdrop-blur-sm
                "
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-purple-400 flex-shrink-0">
                  <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                </svg>
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GptSearchBar;
