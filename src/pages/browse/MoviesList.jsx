import React, { useRef, useState, useEffect } from "react";
import MovieCard from "./MovieCard";

const SkeletonCard = () => (
  <div className="
    flex-shrink-0
    min-w-[120px] sm:min-w-[150px] md:min-w-[180px] lg:min-w-[200px]
    h-[180px] sm:h-[225px] md:h-[270px] lg:h-[300px]
    bg-neutral-800 rounded-lg animate-pulse
  " />
);

const ChevronLeft = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const ChevronRight = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
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
    scrollRef.current?.scrollBy({ left: dir * 600, behavior: "smooth" });
  };

  return (
    <div className="relative group/list">
      <h1 className="text-xl sm:text-2xl font-bold text-white mb-3 px-2 sm:px-0">
        {title}
      </h1>

      {error ? (
        <div className="flex items-center gap-3 bg-neutral-900 border border-neutral-700 rounded-lg px-5 py-4 text-sm text-gray-400">
          <span className="text-xl">⚠️</span>
          <span>Failed to load {title.toLowerCase()}. Check your connection and try again.</span>
        </div>
      ) : (
        <div className="relative">
          {/* Left arrow */}
          <button
            onClick={() => scroll(-1)}
            aria-label="Scroll left"
            className={`
              absolute left-0 top-1/2 -translate-y-1/2 z-10
              bg-black/80 hover:bg-black border border-white/20 hover:border-white/50
              text-white p-2 rounded-full
              transition-all duration-200 hover:scale-110
              ${canScrollLeft ? "opacity-0 group-hover/list:opacity-100 cursor-pointer" : "hidden"}
            `}
          >
            <ChevronLeft />
          </button>

          {/* Scroll container */}
          <div
            ref={scrollRef}
            className="overflow-x-auto overflow-y-hidden scrollbar-hide"
          >
            <div className="flex gap-3 sm:gap-4 px-2 sm:px-0">
              {movies === null ? (
                [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
              ) : movies.length === 0 ? (
                <div className="flex items-center gap-3 bg-neutral-900 border border-neutral-700 rounded-lg px-5 py-4 text-sm text-gray-400">
                  <span className="text-xl">🎬</span>
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

          {/* Right arrow */}
          <button
            onClick={() => scroll(1)}
            aria-label="Scroll right"
            className={`
              absolute right-0 top-1/2 -translate-y-1/2 z-10
              bg-black/80 hover:bg-black border border-white/20 hover:border-white/50
              text-white p-2 rounded-full
              transition-all duration-200 hover:scale-110
              ${canScrollRight ? "opacity-0 group-hover/list:opacity-100 cursor-pointer" : "hidden"}
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
