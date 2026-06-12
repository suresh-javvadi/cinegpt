import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { API_GET_OPTIONS } from "../../utils/constants";
import GptMovieCard from "../gptSearch/GptMovieCard";
import Header from "../../components/Header";

const SearchPage = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      setHasSearched(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query.trim())}&include_adult=false&page=1`,
          API_GET_OPTIONS,
        );
        const data = await res.json();
        setResults(data.results?.filter((m) => m.poster_path) ?? []);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

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
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="flex-1 flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-4 py-2.5">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="text-gray-400 flex-shrink-0">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" strokeLinecap="round" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies — Telugu, Hindi, Hollywood..."
              className="flex-1 bg-transparent text-white placeholder-gray-500 text-sm sm:text-base focus:outline-none"
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-gray-500 hover:text-white transition cursor-pointer">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
            {Array(12).fill(0).map((_, i) => (
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
            <svg width="52" height="52" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24" className="text-gray-700">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" strokeLinecap="round" />
            </svg>
            <p className="text-gray-400 text-base">Search for any movie</p>
            <p className="text-gray-600 text-sm">Telugu, Hindi, Hollywood and more</p>
          </div>
        )}

        {/* No results */}
        {!isLoading && hasSearched && results.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <svg width="52" height="52" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24" className="text-gray-700">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" strokeLinecap="round" />
            </svg>
            <p className="text-gray-400 text-base font-medium">No results for &ldquo;{query}&rdquo;</p>
            <p className="text-gray-600 text-sm">Try a different title or spelling</p>
          </div>
        )}

        {/* Results grid */}
        {!isLoading && results.length > 0 && (
          <>
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-4">
              {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
              {results.map((movie) => (
                <GptMovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
