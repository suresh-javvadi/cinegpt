import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const VideoTitle = ({ movie }) => {
  const { id, title, overview } = movie;
  const navigate = useNavigate();
  const movieTrailer = useSelector((store) => store.movies?.movieTrailers[id]);

  return (
    <div
      className="
      absolute inset-0 z-10
      flex flex-col
      justify-end sm:justify-center
      text-white
      bg-gradient-to-r from-black/80 via-black/30 to-transparent
      px-4 sm:px-10 md:px-16
      pb-10 sm:pb-0
      space-y-2 sm:space-y-4
    "
    >
      {/* Badge */}
      <div className="flex items-center gap-2">
        <span className="bg-red-600 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider">
          Now Playing
        </span>
      </div>

      {/* Title */}
      <h1 className="text-lg sm:text-3xl md:text-5xl lg:text-6xl font-black max-w-[60%] sm:max-w-xl leading-tight drop-shadow-lg line-clamp-2">
        {title}
      </h1>

      {/* Overview — hidden on small mobile, shown sm+ */}
      <p
        className="
        hidden sm:line-clamp-3
        text-sm md:text-base
        max-w-xs md:max-w-lg
        text-gray-200
        leading-relaxed
        drop-shadow
      "
      >
        {overview}
      </p>

      {/* Buttons */}
      <div className="flex items-center gap-2 sm:gap-3 pt-0.5">
        {movieTrailer?.key ? (
          <a
            href={`https://www.youtube.com/watch?v=${movieTrailer.key}`}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex items-center gap-1.5
              bg-white text-black
              font-bold text-xs sm:text-sm md:text-base
              px-3 sm:px-6 md:px-7 py-1.5 sm:py-2.5
              rounded-lg
              hover:bg-white/85
              active:scale-95
              transition-all duration-200
              shadow-lg
              cursor-pointer
            "
          >
            <svg
              width="14"
              height="14"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="sm:w-[18px] sm:h-[18px]"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
            Play
          </a>
        ) : (
          <button
            disabled
            className="
              flex items-center gap-1.5
              bg-white text-black
              font-bold text-xs sm:text-sm md:text-base
              px-3 sm:px-6 md:px-7 py-1.5 sm:py-2.5
              rounded-lg
              cursor-not-allowed opacity-60
            "
          >
            <svg
              width="14"
              height="14"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="sm:w-[18px] sm:h-[18px]"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
            Play
          </button>
        )}

        <button
          onClick={() => navigate(`/movie/${id}`)}
          className="
            flex items-center gap-1.5
            bg-white/20 backdrop-blur-sm
            border border-white/30
            text-white font-semibold text-xs sm:text-sm md:text-base
            px-3 sm:px-6 md:px-7 py-1.5 sm:py-2.5
            rounded-lg
            hover:bg-white/30
            active:scale-95
            transition-all duration-200
            cursor-pointer
          "
        >
          <svg
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            className="sm:w-[18px] sm:h-[18px]"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          More Info
        </button>
      </div>
    </div>
  );
};

export default VideoTitle;
