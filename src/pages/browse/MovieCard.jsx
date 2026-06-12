import React, { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { MOVIE_IMAGE_URL, API_GET_OPTIONS } from "../../utils/constants";
import { createPortal } from "react-dom";

/* ── Trailer Modal ─────────────────────────────────────────── */
const TrailerModal = ({ movie, trailerKey, onClose }) => {
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
      style={{ animation: "tmFadeIn 0.2s ease both" }}
      onMouseDown={handleBackdrop}
    >
      {/* Blurred backdrop */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />

      {/* Card */}
      <div
        className="relative w-full max-w-3xl z-10"
        style={{ animation: "tmPopIn 0.25s cubic-bezier(0.16,1,0.3,1) both" }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm sm:text-base truncate">
              {movie.title}
            </p>
            {movie.release_date && (
              <p className="text-gray-500 text-xs mt-0.5">
                {movie.release_date.slice(0, 4)}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 ml-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/8 hover:bg-white/16 border border-white/10 text-gray-400 hover:text-white transition cursor-pointer"
          >
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Video embed */}
        <div className="relative w-full rounded-2xl overflow-hidden border border-white/8 shadow-2xl shadow-black/70" style={{ paddingBottom: "56.25%" }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
            title={movie.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Hint */}
        <p className="text-center text-gray-700 text-[11px] mt-3">
          Click outside to close
        </p>
      </div>

      <style>{`
        @keyframes tmFadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes tmPopIn  { from { opacity:0; transform:scale(0.94) translateY(12px) } to { opacity:1; transform:scale(1) translateY(0) } }
      `}</style>
    </div>,
    document.body
  );
};

/* ── MovieCard ─────────────────────────────────────────────── */
const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const [trailerLoading, setTrailerLoading] = useState(false);
  const [trailerUnavailable, setTrailerUnavailable] = useState(false);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const longPressTimer = useRef(null);

  if (!movie.poster_path) return null;

  const year = movie.release_date?.slice(0, 4);
  const rating = movie.vote_average
    ? (Math.round(movie.vote_average * 10) / 10).toFixed(1)
    : null;

  const fetchTrailer = async () => {
    if (trailerKey || trailerLoading || trailerUnavailable) return;
    setTrailerLoading(true);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}/videos?language=en-US`,
        API_GET_OPTIONS
      );
      const data = await res.json();
      const pick =
        data.results?.find((v) => v.site === "YouTube" && v.type === "Trailer" && v.official) ||
        data.results?.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
        data.results?.find((v) => v.site === "YouTube");
      if (pick) setTrailerKey(pick.key);
      else setTrailerUnavailable(true);
    } catch {
      setTrailerUnavailable(true);
    } finally {
      setTrailerLoading(false);
    }
  };

  const handleMouseEnter = () => {
    setHovered(true);
    fetchTrailer(); // prefetch while user reads the overlay
  };

  const startLongPress = () => {
    longPressTimer.current = setTimeout(() => {
      setHovered(true);
      fetchTrailer();
    }, 400);
  };
  const endLongPress = () => {
    clearTimeout(longPressTimer.current);
    setHovered(false);
  };

  const openTrailer = (e) => {
    e.stopPropagation();
    if (trailerKey) setTrailerOpen(true);
  };

  return (
    <>
      <div
        onClick={() => navigate(`/movie/${movie.id}`)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setHovered(false)}
        onTouchStart={startLongPress}
        onTouchEnd={endLongPress}
        onTouchCancel={endLongPress}
        className="
          w-[29vw] sm:w-[150px] md:w-[170px] lg:w-[200px]
          aspect-[2/3]
          rounded-lg
          overflow-hidden
          cursor-pointer
          relative
          transition
          duration-300
          hover:scale-105
          active:scale-95
        "
      >
        <img
          src={MOVIE_IMAGE_URL + movie.poster_path}
          alt={movie?.title}
          className={`w-full h-full object-cover transition-all duration-700 ${trailerLoading ? "brightness-[0.35]" : "brightness-100"}`}
        />

        {/* Soft inner glow while loading */}
        {trailerLoading && (
          <>
            <style>{`@keyframes innerGlow{0%,100%{opacity:0.2;transform:scale(0.6)}50%{opacity:1;transform:scale(1.4)}}`}</style>
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(255,255,255,0.22) 0%, transparent 70%)",
                animation: "innerGlow 1.6s ease-in-out infinite",
              }}
            />
          </>
        )}

        {/* Hover overlay */}
        <div
          className={`absolute inset-0 flex flex-col justify-end transition-opacity duration-200 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
          }}
        >
          {/* Trailer button */}
          <div className="flex justify-center mb-2 sm:mb-3 px-2">
            {hovered && <style>{`@keyframes btnZoomIn{from{opacity:0;transform:scale(0.3)}to{opacity:1;transform:scale(1)}}`}</style>}
            {trailerUnavailable ? (
              <span key="unavail" style={{animation:"btnZoomIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both"}} className="flex items-center gap-1.5 bg-white/10 border border-white/15 text-gray-500 text-[10px] sm:text-xs px-3 py-1.5 rounded-full">
                {/* YouTube icon greyed */}
                <svg width="13" height="9" viewBox="0 0 24 17" fill="currentColor" className="opacity-40">
                  <path d="M23.5 2.5S23.2.7 22.4 0C21.4-1 20.3-1 19.8-1 16.5-.8 12-.8 12-.8s-4.5 0-7.8.2C3.7-.6 2.6-.6 1.6.4.8 1.2.5 3 .5 3S.2 5.1.2 7.2v2c0 2.1.3 4.2.3 4.2s.3 1.8 1.1 2.5c1 1 2.3.9 2.9 1C6.4 17.2 12 17.2 12 17.2s4.5 0 7.8-.3c.5-.1 1.6-.1 2.6-1.1.8-.7 1.1-2.5 1.1-2.5s.3-2.1.3-4.2v-2C23.8 4.9 23.5 2.5 23.5 2.5zM9.7 11.5V5.3l6.6 3.1-6.6 3.1z"/>
                </svg>
                No trailer available
              </span>
            ) : (
              <button
                key="play"
                onClick={openTrailer}
                disabled={trailerLoading}
                style={{animation:"btnZoomIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both"}}
                className="flex items-center gap-1.5 bg-[#FF0000] hover:bg-[#cc0000] active:scale-95 text-white text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-1.5 rounded-full shadow-lg shadow-red-900/40 transition-all duration-150 cursor-pointer disabled:opacity-70"
              >
                {trailerLoading ? (
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  /* YouTube logo */
                  <svg width="14" height="10" viewBox="0 0 24 17" fill="white">
                    <path d="M23.5 2.5S23.2.7 22.4 0C21.4-1 20.3-1 19.8-1 16.5-.8 12-.8 12-.8s-4.5 0-7.8.2C3.7-.6 2.6-.6 1.6.4.8 1.2.5 3 .5 3S.2 5.1.2 7.2v2c0 2.1.3 4.2.3 4.2s.3 1.8 1.1 2.5c1 1 2.3.9 2.9 1C6.4 17.2 12 17.2 12 17.2s4.5 0 7.8-.3c.5-.1 1.6-.1 2.6-1.1.8-.7 1.1-2.5 1.1-2.5s.3-2.1.3-4.2v-2C23.8 4.9 23.5 2.5 23.5 2.5zM9.7 11.5V5.3l6.6 3.1-6.6 3.1z"/>
                  </svg>
                )}
                {trailerLoading ? "…" : "Play"}
              </button>
            )}
          </div>

          {/* Title + meta */}
          <div className="px-2 pb-2">
            <p className="text-white text-[11px] sm:text-xs font-semibold leading-tight line-clamp-2">
              {movie.title}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              {rating && (
                <span className="flex items-center gap-0.5 text-yellow-400 text-[10px] sm:text-[11px] font-medium">
                  ★ {rating}
                </span>
              )}
              {year && (
                <span className="text-gray-400 text-[10px] sm:text-[11px]">{year}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Portal trailer modal */}
      {trailerOpen && trailerKey && (
        <TrailerModal
          movie={movie}
          trailerKey={trailerKey}
          onClose={() => setTrailerOpen(false)}
        />
      )}
    </>
  );
};

export default MovieCard;
