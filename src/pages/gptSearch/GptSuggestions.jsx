import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearGptResults } from "../../slices/gptSlice";
import GptMovieCard from "./GptMovieCard";

const GptSuggestions = () => {
  const dispatch = useDispatch();
  const { gptMovieNames, gptMovieResults, gptQuery } = useSelector(
    (store) => store.gptSearch
  );

  if (!gptMovieNames?.length) {
    return (
      <div className="mt-10 flex flex-col items-center gap-3 text-center px-4">
        <div className="w-16 h-16 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
          <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="text-gray-600">
            <path d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-gray-500 text-sm">Your recommendations will appear here</p>
        <p className="text-gray-700 text-xs">Try a prompt above or pick one of the suggestions</p>
      </div>
    );
  }

  // Best match (first TMDB result) for each GPT recommendation — #8
  const topPicks = gptMovieResults
    .map((results) => results?.[0])
    .filter(Boolean);

  return (
    <div className="mt-8 w-full max-w-5xl mx-auto space-y-6">
      {/* Query header + clear button — #8 & #9 */}
      <div className="flex items-start justify-between gap-4 px-1">
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">AI recommendations for</p>
          <h2 className="text-white font-bold text-lg sm:text-xl leading-snug">
            &ldquo;{gptQuery}&rdquo;
          </h2>
        </div>
        <button
          onClick={() => dispatch(clearGptResults())}
          className="flex-shrink-0 flex items-center gap-1.5 text-gray-400 hover:text-white text-xs sm:text-sm border border-white/10 hover:border-white/30 px-3 py-1.5 rounded-lg transition cursor-pointer mt-1"
        >
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
          Clear
        </button>
      </div>

      {/* Top 5 picks — one clean horizontal row — #8 */}
      <div>
        <p className="text-gray-400 text-sm font-semibold mb-3 px-1">Top Picks</p>
        <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-2 px-1">
          {topPicks.map((movie) => (
            <GptMovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10" />

      {/* All results per recommendation — labelled by number, not movie name */}
      <div className="space-y-6">
        <p className="text-gray-400 text-sm font-semibold px-1">All Recommendations</p>
        {gptMovieNames.map((movieName, index) => {
          const movies = gptMovieResults[index];
          if (!movies?.length) return null;
          return (
            <div key={movieName}>
              <p className="text-gray-300 text-sm font-medium mb-2 px-1">
                <span className="text-purple-400 font-bold mr-2">#{index + 1}</span>
                {movieName}
              </p>
              <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-2 px-1">
                {movies.slice(0, 8).filter((m) => m.poster_path).map((movie) => (
                  <GptMovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GptSuggestions;
