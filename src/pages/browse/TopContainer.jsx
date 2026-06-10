import React, { useState } from "react";
import VideoTitle from "./VideoTitle";
import VideoBackground from "./VideoBackground";
import { useSelector } from "react-redux";

const TopContainer = () => {
  const movies = useSelector((store) => store.movies?.nowPlayingMovies);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!movies || movies.length === 0) return null;

  const mainMovie = movies[currentIndex];
  const dotCount = Math.min(movies.length, 10);

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? movies.length - 1 : prev - 1));

  const handleNext = () =>
    setCurrentIndex((prev) => (prev === movies.length - 1 ? 0 : prev + 1));

  return (
    <div className="relative w-full overflow-hidden">
      <VideoBackground movieId={mainMovie?.id} />

      {/* VideoTitle overlay */}
      <VideoTitle movie={mainMovie} />

      {/* Left arrow */}
      <button
        onClick={handlePrev}
        aria-label="Previous"
        className="
          absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 z-20
          flex items-center justify-center
          text-white
          transition-all duration-300
          cursor-pointer
          group/left

          w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm
          sm:w-9 sm:h-20 sm:rounded-2xl sm:bg-black/30
          md:h-28 md:w-11

          hover:bg-white/20
          hover:scale-105
          hover:shadow-[0_0_18px_rgba(255,255,255,0.15)]
        "
      >
        <svg
          width="16" height="16"
          fill="none" stroke="currentColor"
          strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
          viewBox="0 0 24 24"
          className="
            sm:w-7 sm:h-7
            transition-all duration-300
            group-hover/left:drop-shadow-[0_0_5px_rgba(255,255,255,0.9)]
          "
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* Right arrow */}
      <button
        onClick={handleNext}
        aria-label="Next"
        className="
          absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 z-20
          flex items-center justify-center
          text-white
          transition-all duration-300
          cursor-pointer
          group/right

          w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm
          sm:w-9 sm:h-20 sm:rounded-2xl sm:bg-black/30
          md:h-28 md:w-11

          hover:bg-white/20
          hover:scale-105
          hover:shadow-[0_0_18px_rgba(255,255,255,0.15)]
        "
      >
        <svg
          width="16" height="16"
          fill="none" stroke="currentColor"
          strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
          viewBox="0 0 24 24"
          className="
            sm:w-7 sm:h-7
            transition-all duration-300
            group-hover/right:drop-shadow-[0_0_5px_rgba(255,255,255,0.9)]
          "
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
        {[...Array(dotCount)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 cursor-pointer ${
              i === currentIndex
                ? "bg-white w-4 sm:w-5 md:w-6 h-1 sm:h-1.5"
                : "bg-white/40 hover:bg-white/70 w-1 sm:w-1.5 h-1 sm:h-1.5"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default TopContainer;
