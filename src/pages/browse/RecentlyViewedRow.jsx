import React, { useState } from "react";
import { useNavigate } from "react-router";
import { MOVIE_CARD_IMAGE_URL } from "../../utils/constants";
import {
  getRecentlyViewed,
  removeRecentlyViewed,
  clearRecentlyViewed,
} from "../../hooks/useRecentlyViewed";

const RecentlyViewedRow = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState(() => getRecentlyViewed());

  const handleRemove = (e, id) => {
    e.stopPropagation();
    removeRecentlyViewed(id);
    setMovies((prev) => prev.filter((m) => m.id !== id));
  };

  const handleClear = () => {
    clearRecentlyViewed();
    setMovies([]);
  };

  if (movies.length === 0) return null;

  const rating = (v) => (v ? (Math.round(v * 10) / 10).toFixed(1) : null);

  return (
    <div className="relative group/list">
      <div className="flex items-center justify-between mb-2 sm:mb-3 px-2 sm:px-0">
        <h1 className="text-base sm:text-xl md:text-2xl font-bold text-white">
          Recently Viewed
        </h1>
        <button
          onClick={handleClear}
          className="text-[11px] text-gray-600 hover:text-gray-400 transition cursor-pointer"
        >
          Clear all
        </button>
      </div>

      <div className="overflow-x-auto overflow-y-hidden scrollbar-hide">
        <div className="flex gap-2 sm:gap-3 px-1 sm:px-0">
          {movies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => navigate(`/movie/${movie.id}`)}
              className="relative flex-shrink-0 cursor-pointer group/card"
            >
              {/* Poster */}
              <div className="w-[22vw] sm:w-[100px] md:w-[120px] lg:w-[140px] aspect-[2/3] rounded-lg overflow-hidden">
                <img
                  src={MOVIE_CARD_IMAGE_URL + movie.poster_path}
                  alt={movie.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition duration-300 group-hover/card:scale-105 group-hover/card:brightness-75"
                />
              </div>

              {/* Remove button */}
              <button
                onClick={(e) => handleRemove(e, movie.id)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 border border-white/20 text-white flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity hover:bg-red-600/80 cursor-pointer z-10"
                aria-label="Remove"
              >
                <svg width="8" height="8" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>

              {/* Rating badge */}
              {rating(movie.vote_average) && (
                <span className="absolute bottom-1 left-1 text-[10px] font-semibold bg-black/70 text-yellow-400 px-1.5 py-0.5 rounded">
                  ★ {rating(movie.vote_average)}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentlyViewedRow;
