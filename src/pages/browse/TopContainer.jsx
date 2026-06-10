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

      {/* Left arrow — tall frosted bar */}
      <button
        onClick={handlePrev}
        aria-label="Previous"
        className="
          absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20
          h-20 sm:h-28 w-9 sm:w-11
          flex items-center justify-center
          bg-black/30 hover:bg-white/15
          backdrop-blur-xl
          rounded-2xl
          text-white
          transition-all duration-300
          hover:scale-105
          hover:shadow-[0_0_24px_rgba(255,255,255,0.2)]
          cursor-pointer
          group/left
        "
      >
        <svg
          width="28" height="28"
          fill="none" stroke="currentColor"
          strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
          viewBox="0 0 24 24"
          className="transition-all duration-300 group-hover/left:stroke-white group-hover/left:drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* VideoTitle overlay */}
      <VideoTitle movie={mainMovie} />

      {/* Right arrow — tall frosted bar */}
      <button
        onClick={handleNext}
        aria-label="Next"
        className="
          absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20
          h-20 sm:h-28 w-9 sm:w-11
          flex items-center justify-center
          bg-black/30 hover:bg-white/15
          backdrop-blur-xl
          rounded-2xl
          text-white
          transition-all duration-300
          hover:scale-105
          hover:shadow-[0_0_24px_rgba(255,255,255,0.2)]
          cursor-pointer
          group/right
        "
      >
        <svg
          width="28" height="28"
          fill="none" stroke="currentColor"
          strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
          viewBox="0 0 24 24"
          className="transition-all duration-300 group-hover/right:stroke-white group-hover/right:drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
        {[...Array(dotCount)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 cursor-pointer ${
              i === currentIndex
                ? "bg-white w-5 sm:w-6 h-1.5"
                : "bg-white/40 hover:bg-white/70 w-1.5 h-1.5"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default TopContainer;
