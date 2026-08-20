import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import useFetchMovies from "../../hooks/useFetchMovies";
import { addNowPlayingMovies } from "../../slices/movieSlice";
import { MOVIE_CARD_IMAGE_URL } from "../../utils/constants";

const STATS = [
  { value: "10K+", label: "Titles" },
  { value: "10", label: "Languages" },
  { value: "AI", label: "Verified picks" },
];

const POSTER_TILT = ["-8deg", "-4deg", "0deg", "4deg", "8deg"];

const LandingHero = ({ onRequireAuth }) => {
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const nowPlaying = useSelector((store) => store.movies?.nowPlayingMovies);

  // Warms the same redux cache Browse reads, so /browse renders instantly after sign in
  useFetchMovies(
    "https://api.themoviedb.org/3/movie/now_playing",
    addNowPlayingMovies,
    (store) => store.movies?.nowPlayingMovies,
  );

  const posters = (nowPlaying ?? []).filter((m) => m.poster_path).slice(0, 5);

  // Signed out, the CTA walks the user to the auth card instead of the destination
  const go = (path, label) =>
    user ? navigate(path) : onRequireAuth?.(path, label);

  return (
    <div className="w-full max-w-xl text-center lg:text-left">
      {/* Eyebrow */}
      <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-6 bg-white/[0.06] border border-white/10 backdrop-blur-sm">
        <span className="relative flex w-1.5 h-1.5">
          <span className="absolute inline-flex w-full h-full rounded-full bg-red-500 opacity-75 animate-ping" />
          <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-red-500" />
        </span>
        <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.18em] uppercase text-gray-300">
          AI-powered discovery
        </span>
      </div>

      {/* Headline */}
      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05]">
        <span style={{ fontFamily: "'Great Vibes', cursive", fontWeight: 400 }}>
          Describe it.
        </span>
        <br />
        <span className="text-red-500">We&apos;ll find it.</span>
      </h1>

      {/* Subcopy */}
      <p className="mt-5 text-sm sm:text-base text-gray-400 leading-relaxed max-w-md mx-auto lg:mx-0">
        Tell CineGPT a mood, a plot you half-remember, or an actor you love —
        and get five matched movies in seconds. Then browse trending, genres and
        trailers across 10 languages.
      </p>

      {/* CTAs */}
      <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3">
        <button
          onClick={() => go("/gpt-search", "AI Search")}
          className="group flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:brightness-110 active:scale-95"
          style={{
            background: "linear-gradient(135deg, #dc2626, #7f1d1d)",
            boxShadow: "0 12px 32px rgba(220,38,38,0.35)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
          </svg>
          {user ? "Try AI Search" : "Sign in to try AI Search"}
          <span className="transition-transform duration-200 group-hover:translate-x-0.5">
            →
          </span>
        </button>

        <button
          onClick={() => go("/browse", "Browse")}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-white/[0.07] border border-white/10 backdrop-blur-sm transition-all duration-200 hover:bg-white/[0.13] active:scale-95"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M3 10h18M9 4v6" />
          </svg>
          Browse movies
        </button>
      </div>

      {/* Stats */}
      <div className="mt-8 flex items-center justify-center lg:justify-start gap-6 sm:gap-8">
        {STATS.map((s) => (
          <div key={s.label}>
            <div className="text-lg sm:text-xl font-black text-white">
              {s.value}
            </div>
            <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-gray-500">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Poster fan — live from TMDB now playing */}
      <div className="mt-10 hidden sm:block">
        <div className="flex items-end justify-center lg:justify-start -space-x-4">
          {(posters.length ? posters : Array(5).fill(null)).map((movie, i) => (
            <div
              key={movie?.id ?? i}
              className="transition-all duration-300 hover:z-10 hover:-translate-y-2"
              style={{
                animation: `heroPosterIn 600ms ease-out ${i * 90}ms both`,
              }}
            >
              <div
                title={movie?.title}
                className="w-20 lg:w-24 aspect-[2/3] rounded-lg overflow-hidden border border-white/10 bg-neutral-900 shadow-2xl transition-colors duration-300 hover:border-white/25"
                style={{ transform: `rotate(${POSTER_TILT[i]})` }}
              >
                {movie ? (
                  <img
                    src={MOVIE_CARD_IMAGE_URL + movie.poster_path}
                    alt={movie.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full animate-pulse bg-white/[0.04]" />
                )}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[11px] text-gray-500 tracking-wide">
          In theatres now — updated daily from TMDB
        </p>
      </div>

      <style>{`
        @keyframes heroPosterIn {
          from { opacity: 0; transform: translateY(14px) }
        }
      `}</style>
    </div>
  );
};

export default LandingHero;
