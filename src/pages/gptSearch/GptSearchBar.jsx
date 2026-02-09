import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import lang from "../../utils/languagesConstants";
import { API_GET_OPTIONS } from "../../utils/constants";
import { addGptMovieResult } from "../../slices/gptSlice";

const GptSearchBar = () => {
  const dispatch = useDispatch();
  const selectedLang = useSelector((store) => store.config.lang);
  const searchTerm = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const fetchMovie = async (movie) => {
    const data = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${movie}&include_adult=false&language=en-US&page=1`,
      API_GET_OPTIONS,
    );

    const json = await data.json();

    return json.results;
  };

  const handleGptSearch = async () => {
    const query = searchTerm.current.value.trim();
    if (!query) return;

    setIsLoading(true);
    setIsSuccess(false);

    try {
      const firstRes = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "openrouter/free",
            reasoning: { enabled: true },
            messages: [
              {
                role: "system",
                content:
                  "You are a precise movie recommendation engine. Accuracy and formatting are critical.",
              },
              {
                role: "user",
                content: `Recommend movies based on this query:
                          "${query}"
                          Rules:
                          - Use real, well-known movies only
                          - Exactly 5 movie titles
                          - No numbering
                          - No explanations
                          - Comma-separated
                          - Single line`,
              },
            ],
          }),
        },
      );

      if (!firstRes.ok) {
        throw new Error(`First OpenRouter call failed: ${firstRes.status}`);
      }

      const firstData = await firstRes.json();
      const assistantMessage = firstData?.choices?.[0]?.message;

      if (!assistantMessage?.content) {
        throw new Error("Invalid first OpenRouter response");
      }

      /* -------------------- STEP 2: VERIFICATION & CORRECTION -------------------- */

      const secondRes = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "openrouter/free",
            messages: [
              {
                role: "user",
                content: `Recommend movies based on:
                          "${query}"`,
              },
              {
                role: "assistant",
                content: assistantMessage.content,
                reasoning_details: assistantMessage.reasoning_details, // 🔑 critical
              },
              {
                role: "user",
                content: `Check your previous answer carefully.
                          Fix any mistakes.
                          Ensure:
                          - Exactly 5 real movie titles
                          - Correct spelling
                          - No duplicates
                          - Comma-separated
                          - Single line only
                          Return ONLY the corrected movie list.`,
              },
            ],
          }),
        },
      );

      if (!secondRes.ok) {
        throw new Error(`Second OpenRouter call failed: ${secondRes.status}`);
      }

      const secondData = await secondRes.json();
      const finalContent = secondData?.choices?.[0]?.message?.content;

      if (!finalContent) {
        throw new Error("Invalid final OpenRouter response");
      }

      const gptMovies = finalContent
        .split(",")
        .map((m) => m.trim())
        .filter(Boolean)
        .slice(0, 5);

      if (gptMovies.length !== 5) {
        console.warn("GPT output still imperfect:", finalContent);
      }

      const movieResults = await Promise.all(
        gptMovies.map((movie) => fetchMovie(movie)),
      );

      dispatch(addGptMovieResult({ movieNames: gptMovies, movieResults }));
      searchTerm.current.value = "";
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 1200);
    } catch (err) {
      console.error("GPT Search Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center pt-24 sm:pt-32">
      <form
        className="
      w-full
      max-w-xl sm:max-w-2xl        
      p-2 
      bg-black/80 
      rounded-lg 
      grid grid-cols-12 
      gap-2
    "
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          ref={searchTerm}
          type="text"
          placeholder={lang[selectedLang]?.gptSearchPlaceHolder}
          className="
        col-span-9 
        sm:col-span-10 
        p-3 sm:p-4 
        bg-white 
        text-black
        rounded-lg 
      "
        />

        <button
          onClick={handleGptSearch}
          disabled={isLoading}
          className={`
    col-span-3 sm:col-span-2 
    rounded-lg 
    font-medium 
    flex items-center justify-center
    transition-all duration-300
    ${isLoading ? "bg-red-800 w-12" : "bg-red-700 p-3 sm:p-4 text-white"}
    ${isSuccess ? "bg-green-600" : ""}
  `}
        >
          {isLoading ? (
            <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : isSuccess ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            lang[selectedLang]?.search
          )}
        </button>
      </form>
    </div>
  );
};

export default GptSearchBar;
