import React, { useState, useEffect, useRef } from "react";
import VideoTitle from "./VideoTitle";
import VideoBackground from "./VideoBackground";
import { useSelector } from "react-redux";

const AUTOPLAY_DELAY_VIDEO = 10000;
const AUTOPLAY_DELAY_NO_VIDEO = 5000;

const TopContainer = () => {
  const movies = useSelector((store) => store.movies?.nowPlayingMovies);
  const movieTrailers = useSelector((store) => store.movies?.movieTrailers);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);
  const nextSlideAtRef = useRef(null); // absolute timestamp when next slide should fire

  const total = movies?.length ?? 0;
  const dotCount = Math.min(total, 10);
  const mainMovie = movies?.[currentIndex] ?? null;
  const currentTrailer = movieTrailers?.[mainMovie?.id];
  const delay =
    currentTrailer === null ? AUTOPLAY_DELAY_NO_VIDEO : AUTOPLAY_DELAY_VIDEO;

  // How far into the current slide we already are (for dot animation offset)
  const dotElapsed = nextSlideAtRef.current
    ? Math.max(0, delay - Math.max(0, nextSlideAtRef.current - Date.now()))
    : 0;

  useEffect(() => {
    if (!total) return;

    if (paused) {
      clearTimeout(timerRef.current);
      return;
    }

    // Resume from where we left off, or start fresh
    const fireAt = nextSlideAtRef.current ?? Date.now() + delay;
    nextSlideAtRef.current = fireAt;
    const remaining = Math.max(200, fireAt - Date.now());

    timerRef.current = setTimeout(() => {
      nextSlideAtRef.current = null;
      setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
    }, remaining);

    return () => clearTimeout(timerRef.current);
  }, [currentIndex, delay, total, paused]);

  if (!movies || movies.length === 0) return null;

  const handlePrev = () => {
    nextSlideAtRef.current = null;
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const handleNext = () => {
    nextSlideAtRef.current = null;
    setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  const handleDot = (i) => {
    nextSlideAtRef.current = null;
    setCurrentIndex(i);
  };

  return (
    <div className="relative w-full overflow-hidden">
      <VideoBackground
        movieId={mainMovie?.id}
        backdropPath={mainMovie?.backdrop_path}
        setPaused={setPaused}
      />

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
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
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
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
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
      <div className="absolute bottom-6 sm:bottom-32 md:bottom-44 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
        {[...Array(dotCount)].map((_, i) => (
          <button
            key={i}
            onClick={() => handleDot(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`relative rounded-full overflow-hidden transition-all duration-300 cursor-pointer ${
              i === currentIndex
                ? "bg-white/30 w-12 sm:w-14 md:w-16 h-1 sm:h-1.5"
                : "bg-white/40 hover:bg-white/70 w-1 sm:w-1.5 h-1 sm:h-1.5"
            }`}
          >
            {i === currentIndex && !paused && (
              <span
                className="absolute inset-y-0 left-0 bg-white rounded-full"
                style={{
                  animation: `dotProgress ${delay}ms linear forwards`,
                  animationDelay: `-${dotElapsed}ms`,
                }}
              />
            )}
          </button>
        ))}
      </div>

      <style>{`
        @keyframes dotProgress { from { width: 0% } to { width: 100% } }
      `}</style>
    </div>
  );
};

export default TopContainer;
