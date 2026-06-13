import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearGptResults } from "../../slices/gptSlice";
import GptMovieCard from "./GptMovieCard";

const GptSuggestions = () => {
  const dispatch = useDispatch();
  const { gptMovieNames, gptMovieResults, gptQuery } = useSelector(
    (store) => store.gptSearch,
  );

  if (!gptMovieNames?.length) {
    return (
      <div className="mt-16 flex flex-col items-center gap-4 text-center px-4">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center"
          style={{
            background: "rgba(139,92,246,0.08)",
            border: "1px solid rgba(139,92,246,0.2)",
          }}
        >
          <svg
            width="36"
            height="36"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            viewBox="0 0 24 24"
            className="text-purple-500/60"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
            />
          </svg>
        </div>
        <div>
          <p className="text-gray-300 text-base font-medium">No results yet</p>
          <p className="text-gray-600 text-sm mt-1">
            Try a prompt above or pick one of the examples
          </p>
        </div>
      </div>
    );
  }

  // Prefer the first result that has a poster; fall back to [0] if none do
  const topPicks = gptMovieResults
    .map((results) => results?.find((m) => m?.poster_path) ?? results?.[0])
    .filter((m) => m?.poster_path);

  return (
    <div className="mt-10 w-full max-w-5xl mx-auto">

      {/* Results header */}
      <div
        className="flex items-start justify-between gap-4 mb-8 px-1 pb-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div>
          <p className="text-purple-400/80 text-[10px] font-semibold tracking-[0.25em] uppercase mb-1.5">
            AI Recommendations
          </p>
          <h2 className="text-white font-bold text-xl sm:text-2xl leading-snug">
            &ldquo;{gptQuery}&rdquo;
          </h2>
        </div>
        <button
          onClick={() => dispatch(clearGptResults())}
          className="flex-shrink-0 flex items-center gap-1.5 text-gray-500 hover:text-white text-xs border border-white/10 hover:border-white/25 px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer mt-1"
        >
          <svg
            width="11"
            height="11"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
          Clear
        </button>
      </div>

      {/* Top 5 picks grid */}
      <div className="mb-10">
        <div className="flex items-center gap-2.5 mb-4 px-1">
          <div className="w-1 h-4 rounded-full bg-purple-500" />
          <p className="text-white text-sm font-semibold">Top Picks</p>
          <span
            className="text-[10px] font-medium text-purple-400 px-1.5 py-0.5 rounded-full"
            style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)" }}
          >
            {topPicks.length}
          </span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4">
          {topPicks.map((movie) => (
            <GptMovieCard key={movie.id} movie={movie} featured />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div
        className="mb-8"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      />

      {/* Per-recommendation rows */}
      <div className="space-y-8">
        <div className="flex items-center gap-2.5 px-1 mb-2">
          <div className="w-1 h-4 rounded-full bg-indigo-500" />
          <p className="text-white text-sm font-semibold">All Recommendations</p>
        </div>

        {gptMovieNames.map((movieName, index) => {
          const movies = gptMovieResults[index];
          if (!movies?.length) return null;
          const visibleMovies = movies.slice(0, 8).filter((m) => m.poster_path);
          if (!visibleMovies.length) return null;

          return (
            <div key={movieName}>
              {/* Row label */}
              <div className="flex items-center gap-2.5 mb-3 px-1">
                <span
                  className="text-[11px] font-bold text-purple-300 w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(139,92,246,0.15)" }}
                >
                  {index + 1}
                </span>
                <p className="text-gray-300 text-sm font-medium truncate">{movieName}</p>
              </div>

              {/* Horizontal scroll */}
              <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 px-1"
                style={{ scrollbarWidth: "none" }}
              >
                {visibleMovies.map((movie) => (
                  <div
                    key={movie.id}
                    className="flex-shrink-0 w-[27vw] sm:w-32 md:w-36 lg:w-40"
                  >
                    <GptMovieCard movie={movie} />
                  </div>
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
