import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const VideoTitle = ({ movie }) => {
  const { id, title, overview } = movie;
  const navigate = useNavigate();
  const movieTrailer = useSelector((store) => store.movies?.movieTrailers[id]);

  return (
    <div className="
      absolute inset-0 z-10
      flex flex-col
      justify-end sm:justify-center
      text-white
      bg-gradient-to-r from-black/85 via-black/40 to-transparent
      px-5 sm:px-10 md:px-16
      pb-14 sm:pb-0
      space-y-3 sm:space-y-4
    ">
      {/* Badge */}
      <div className="flex items-center gap-2">
        <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider">
          Now Playing
        </span>
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black max-w-xl leading-tight drop-shadow-lg">
        {title}
      </h1>

      {/* Overview */}
      <p className="
        hidden sm:block
        text-sm md:text-base
        max-w-xs md:max-w-lg
        text-gray-200
        line-clamp-3
        leading-relaxed
        drop-shadow
      ">
        {overview}
      </p>

      {/* Buttons */}
      <div className="flex items-center gap-3 pt-1">
        <button
          onClick={() =>
            movieTrailer?.key &&
            window.open(`https://www.youtube.com/watch?v=${movieTrailer.key}`, "_blank")
          }
          className={`
            flex items-center gap-2
            bg-white text-black
            font-bold text-sm sm:text-base
            px-5 sm:px-7 py-2 sm:py-2.5
            rounded-lg
            hover:bg-white/85
            transition-all duration-200
            shadow-lg
            ${movieTrailer?.key ? "cursor-pointer" : "cursor-not-allowed opacity-60"}
          `}
        >
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          Play
        </button>

        <button
          onClick={() => navigate(`/movie/${id}`)}
          className="
            flex items-center gap-2
            bg-white/20 backdrop-blur-sm
            border border-white/30
            text-white font-semibold text-sm sm:text-base
            px-5 sm:px-7 py-2 sm:py-2.5
            rounded-lg
            hover:bg-white/30
            transition-all duration-200
            cursor-pointer
          "
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
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
