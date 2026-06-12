import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import Header from "../../components/Header";
import GptMovieCard from "../gptSearch/GptMovieCard";
import { API_GET_OPTIONS } from "../../utils/constants";

const SORT_OPTIONS = [
  { label: "Popularity", value: "popularity.desc" },
  { label: "Top Rated", value: "vote_average.desc" },
  { label: "Newest", value: "release_date.desc" },
  { label: "Oldest", value: "release_date.asc" },
];

const GenrePage = () => {
  const { id, name } = useParams();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("popularity.desc");
  const loaderRef = useRef(null);

  const genreName = decodeURIComponent(name ?? "");

  useEffect(() => {
    setMovies([]);
    setPage(1);
    setTotalPages(1);
  }, [id, sort]);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/discover/movie?with_genres=${id}&sort_by=${sort}&vote_count.gte=20&include_adult=false&page=${page}`,
          API_GET_OPTIONS
        );
        const data = await res.json();
        const results = data.results?.filter((m) => m.poster_path) ?? [];
        setMovies((prev) => (page === 1 ? results : [...prev, ...results]));
        setTotalPages(data.total_pages ?? 1);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [id, sort, page]);

  // Infinite scroll observer
  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && page < totalPages) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loading, page, totalPages]);

  return (
    <div className="min-h-screen bg-black text-white pb-20 sm:pb-0">
      <Header />

      <div className="pt-20 sm:pt-24 px-4 sm:px-8 md:px-12 xl:px-16 2xl:px-24 pb-16 max-w-[1800px] mx-auto">
        {/* Header row */}
        <div className="flex items-start sm:items-center justify-between gap-4 mb-8 flex-col sm:flex-row">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition cursor-pointer flex-shrink-0"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-0.5">Genre</p>
              <h1 className="text-2xl sm:text-3xl font-bold leading-tight">{genreName}</h1>
            </div>
          </div>

          {/* Sort selector */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-white/5 border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-white/30 cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="bg-black">
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Initial skeleton */}
        {loading && page === 1 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-9 gap-3 sm:gap-4 2xl:gap-5">
            {Array(18).fill(0).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="w-full aspect-[2/3] rounded-lg bg-white/[0.07] animate-pulse" />
                <div className="h-3 rounded bg-white/[0.07] animate-pulse" />
                <div className="h-3 w-2/3 rounded bg-white/[0.07] animate-pulse" />
              </div>
            ))}
          </div>
        )}

        {/* Grid — real cards + inline shimmer when fetching more */}
        {(movies.length > 0 || (loading && page === 1)) && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-9 gap-3 sm:gap-4 2xl:gap-5">
            {movies.map((movie) => (
              <GptMovieCard key={movie.id} movie={movie} />
            ))}
            {loading && movies.length > 0 && Array(9).fill(0).map((_, i) => (
              <div key={`sk-${i}`} className="space-y-2">
                <div className="w-full aspect-[2/3] rounded-lg bg-white/[0.07] animate-pulse" />
                <div className="h-3 rounded bg-white/[0.07] animate-pulse" />
                <div className="h-3 w-2/3 rounded bg-white/[0.07] animate-pulse" />
              </div>
            ))}
          </div>
        )}

        {/* Infinite scroll sentinel */}
        <div ref={loaderRef} className="h-4" />
      </div>
    </div>
  );
};

export default GenrePage;
