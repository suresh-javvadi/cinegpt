import React, { useRef, useState, useEffect } from "react";
import MovieCard from "./MovieCard";

const SkeletonCard = () => (
  <div className="
    flex-shrink-0
    w-[29vw] sm:w-[150px] md:w-[180px] lg:w-[200px]
    aspect-[2/3]
    bg-neutral-800 rounded-lg animate-pulse
  " />
);

const ChevronLeft = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const ChevronRight = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const MoviesList = ({ title, movies, error }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [movies]);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    // Scroll ~80% of visible width so the next card is partially visible as a hint
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <div className="relative group/list">
      <h1 className="text-base sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3 px-2 sm:px-0">
        {title}
      </h1>

      {error ? (
        <div className="flex items-center gap-3 bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-sm text-gray-400">
          <span className="text-lg">⚠️</span>
          <span>Failed to load {title.toLowerCase()}. Check your connection and try again.</span>
        </div>
      ) : (
        <div className="relative">
          {/* Left arrow — always visible on mobile, hover-only on desktop */}
          <button
            onClick={() => scroll(-1)}
            aria-label="Scroll left"
            className={`
              absolute left-0 top-1/2 -translate-y-1/2 z-10
              bg-black/80 hover:bg-black border border-white/20 hover:border-white/50
              text-white p-2.5 rounded-full
              transition-all duration-200 hover:scale-110
              ${canScrollLeft
                ? "cursor-pointer opacity-100 sm:opacity-0 sm:group-hover/list:opacity-100"
                : "hidden"}
            `}
          >
            <ChevronLeft />
          </button>

          {/* Scroll container */}
          <div
            ref={scrollRef}
            className="overflow-x-auto overflow-y-hidden scrollbar-hide"
          >
            <div className="flex gap-2 sm:gap-3 md:gap-4 px-1 sm:px-0">
              {movies === null ? (
                [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
              ) : movies.length === 0 ? (
                <div className="flex items-center gap-3 bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-sm text-gray-400">
                  <span className="text-lg">🎬</span>
                  <span>No movies available in this category right now.</span>
                </div>
              ) : (
                movies.map((movie) => (
                  <div key={movie.id} className="snap-start flex-shrink-0">
                    <MovieCard movie={movie} />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right arrow — always visible on mobile, hover-only on desktop */}
          <button
            onClick={() => scroll(1)}
            aria-label="Scroll right"
            className={`
              absolute right-0 top-1/2 -translate-y-1/2 z-10
              bg-black/80 hover:bg-black border border-white/20 hover:border-white/50
              text-white p-2.5 rounded-full
              transition-all duration-200 hover:scale-110
              ${canScrollRight
                ? "cursor-pointer opacity-100 sm:opacity-0 sm:group-hover/list:opacity-100"
                : "hidden"}
            `}
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default MoviesList;
