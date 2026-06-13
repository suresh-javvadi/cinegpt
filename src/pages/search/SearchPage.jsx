import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { API_GET_OPTIONS } from "../../utils/constants";
import GptMovieCard from "../gptSearch/GptMovieCard";
import Header from "../../components/Header";

const LANGUAGES = [
  { label: "All",       code: null },
  { label: "Telugu",    code: "te" },
  { label: "Hindi",     code: "hi" },
  { label: "Tamil",     code: "ta" },
  { label: "English",   code: "en" },
  { label: "Malayalam", code: "ml" },
  { label: "Korean",    code: "ko" },
  { label: "Japanese",  code: "ja" },
];

const SearchPage = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const loaderRef = useRef(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeLang, setActiveLang] = useState(null);

  const filteredResults = activeLang
    ? results.filter((m) => m.original_language === activeLang)
    : results;

  const activeLangLabel = LANGUAGES.find((l) => l.code === activeLang)?.label;
  const noLangResults =
    activeLang &&
    hasSearched &&
    !isLoading &&
    page >= totalPages &&
    filteredResults.length === 0 &&
    results.length > 0;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Debounce — reset pagination on every new query
  useEffect(() => {
    if (!query.trim()) {
      setDebouncedQuery("");
      setResults([]);
      setHasSearched(false);
      setPage(1);
      setTotalPages(1);
      return;
    }
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
      setResults([]);
      setPage(1);
      setHasSearched(true);
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch when debouncedQuery or page changes
  useEffect(() => {
    if (!debouncedQuery) return;
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(debouncedQuery)}&include_adult=false&page=${page}`,
          API_GET_OPTIONS,
        );
        const data = await res.json();
        const newResults = data.results?.filter((m) => m.poster_path) ?? [];
        setResults((prev) =>
          page === 1 ? newResults : [...prev, ...newResults],
        );
        setTotalPages(data.total_pages ?? 1);
      } catch {
        if (page === 1) setResults([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovies();
  }, [debouncedQuery, page]);

  // Infinite scroll observer
  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && page < totalPages) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isLoading, page, totalPages]);

  return (
    <div className="min-h-screen bg-black text-white pb-20 sm:pb-0">
      <Header />

      <div className="pt-20 sm:pt-24 px-4 sm:px-8">
        {/* Search bar */}
        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition cursor-pointer"
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                d="M19 12H5M12 5l-7 7 7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="flex-1 flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-4 py-2.5">
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              className="text-gray-400 flex-shrink-0"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" strokeLinecap="round" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies - Telugu, Hindi, Hollywood..."
              className="flex-1 bg-transparent text-white placeholder-gray-500 text-sm sm:text-base focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-gray-500 hover:text-white transition cursor-pointer"
              >
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Language filter chips */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto">
          {LANGUAGES.map((lang) => {
            const active = activeLang === lang.code;
            return (
              <button
                key={lang.label}
                onClick={() => setActiveLang(lang.code)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer border ${
                  active
                    ? "bg-red-600 border-red-600 text-white"
                    : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/25"
                }`}
              >
                {lang.label}
              </button>
            );
          })}
        </div>

        {/* Initial skeleton — page 1 loading */}
        {isLoading && page === 1 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
            {Array(12)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="w-full aspect-[2/3] rounded-lg bg-white/[0.07] animate-pulse" />
                  <div className="h-3 rounded bg-white/[0.07] animate-pulse" />
                  <div className="h-3 w-2/3 rounded bg-white/[0.07] animate-pulse" />
                </div>
              ))}
          </div>
        )}

        {/* Initial state */}
        {!isLoading && !hasSearched && (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <svg
              width="52"
              height="52"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              viewBox="0 0 24 24"
              className="text-gray-700"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" strokeLinecap="round" />
            </svg>
            <p className="text-gray-400 text-base">Search for any movie</p>
            <p className="text-gray-600 text-sm">
              Telugu, Hindi, Hollywood and more
            </p>
          </div>
        )}

        {/* No results */}
        {!isLoading && hasSearched && results.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <svg
              width="52"
              height="52"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              viewBox="0 0 24 24"
              className="text-gray-700"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" strokeLinecap="round" />
            </svg>
            <p className="text-gray-400 text-base font-medium">
              No results for &ldquo;{query}&rdquo;
            </p>
            <p className="text-gray-600 text-sm">
              Try a different title or spelling
            </p>
          </div>
        )}

        {/* Results grid */}
        {filteredResults.length > 0 && (
          <>
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-4">
              {filteredResults.length} result{filteredResults.length !== 1 ? "s" : ""}
              {activeLang ? ` · ${activeLangLabel}` : ""} for &ldquo;{debouncedQuery}&rdquo;
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
              {filteredResults.map((movie) => (
                <GptMovieCard key={movie.id} movie={movie} />
              ))}
              {/* Inline shimmer when loading more pages */}
              {isLoading &&
                page > 1 &&
                Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <div key={`sk-${i}`} className="space-y-2">
                      <div className="w-full aspect-[2/3] rounded-lg bg-white/[0.07] animate-pulse" />
                      <div className="h-3 rounded bg-white/[0.07] animate-pulse" />
                      <div className="h-3 w-2/3 rounded bg-white/[0.07] animate-pulse" />
                    </div>
                  ))}
            </div>
          </>
        )}

        {/* No results in selected language after exhausting all pages */}
        {noLangResults && (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <p className="text-gray-400 text-sm font-medium">
              No {activeLangLabel} results for &ldquo;{debouncedQuery}&rdquo;
            </p>
            <button
              onClick={() => setActiveLang(null)}
              className="text-red-400 text-xs hover:text-red-300 transition cursor-pointer mt-1"
            >
              Show all languages
            </button>
          </div>
        )}

        {/* Infinite scroll sentinel */}
        <div ref={loaderRef} className="h-4" />
      </div>
    </div>
  );
};

export default SearchPage;
