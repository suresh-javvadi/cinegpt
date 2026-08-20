import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { API_GET_OPTIONS, MOVIE_CARD_IMAGE_URL } from "../../utils/constants";
import Header from "../../components/Header";

const PersonSkeleton = () => (
  <div className="space-y-2">
    <div className="w-full aspect-[2/3] rounded-xl bg-white/[0.07] animate-pulse" />
    <div className="h-3 rounded bg-white/[0.07] animate-pulse" />
    <div className="h-3 w-2/3 rounded bg-white/[0.07] animate-pulse" />
  </div>
);

const knownForLine = (person) =>
  (person.known_for ?? [])
    .map((work) => work.title || work.name)
    .filter(Boolean)
    .slice(0, 2)
    .join(" · ");

const ActorsPage = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const loaderRef = useRef(null);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [people, setPeople] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const isSearching = Boolean(debouncedQuery);

  // Debounce — only wipe results when the query genuinely changed. Firing the reset
  // unconditionally cleared the popular list 400ms after mount, and because
  // debouncedQuery/page were unchanged the fetch never re-ran to refill it.
  useEffect(() => {
    const timer = setTimeout(() => {
      const next = query.trim();
      if (next === debouncedQuery) return;
      setDebouncedQuery(next);
      setPeople([]);
      setPage(1);
      setTotalPages(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [query, debouncedQuery]);

  // An empty box falls back to the popular list, so the page is never blank
  useEffect(() => {
    const url = debouncedQuery
      ? `https://api.themoviedb.org/3/search/person?query=${encodeURIComponent(
          debouncedQuery,
        )}&include_adult=false&page=${page}`
      : `https://api.themoviedb.org/3/person/popular?page=${page}`;

    // Guards against a slow earlier request landing after a newer one
    let ignore = false;

    const fetchPeople = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(url, API_GET_OPTIONS);
        const data = await res.json();
        if (ignore) return;
        // person/popular is noisy — drop entries with no photo, no credits or an adult flag
        const cleaned = (data.results ?? []).filter(
          (p) => p.profile_path && !p.adult && (p.known_for?.length ?? 0) > 0,
        );
        setPeople((prev) => (page === 1 ? cleaned : [...prev, ...cleaned]));
        setTotalPages(data.total_pages ?? 1);
      } catch {
        if (!ignore && page === 1) setPeople([]);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };
    fetchPeople();

    return () => {
      ignore = true;
    };
  }, [debouncedQuery, page]);

  // Infinite scroll
  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && page < totalPages) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isLoading, page, totalPages]);

  return (
    <div className="min-h-screen bg-black text-white pb-20 sm:pb-0">
      <Header />

      <div className="pt-20 sm:pt-24 px-4 sm:px-8">
        {/* Search bar */}
        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition cursor-pointer"
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                d="M19 12H5M12 5l-7 7 7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="flex-1 flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-4 py-2.5">
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              className="text-gray-400 flex-shrink-0"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" strokeLinecap="round" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search actors and directors by name..."
              className="flex-1 bg-transparent text-white placeholder-gray-500 text-sm sm:text-base focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="text-gray-500 hover:text-white transition cursor-pointer"
              >
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Section label */}
        <p className="text-gray-500 text-xs uppercase tracking-widest mb-4">
          {isSearching
            ? `Results for ${debouncedQuery}`
            : "Popular actors & directors"}
        </p>

        {/* Page 1 skeleton */}
        {isLoading && page === 1 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
            {Array(12)
              .fill(0)
              .map((_, i) => (
                <PersonSkeleton key={i} />
              ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && people.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <svg
              width="52"
              height="52"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              viewBox="0 0 24 24"
              className="text-gray-700"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" strokeLinecap="round" />
            </svg>
            <p className="text-gray-400 text-base font-medium">
              {isSearching
                ? `No one found for "${debouncedQuery}"`
                : "Nothing to show right now"}
            </p>
            <p className="text-gray-600 text-sm">
              {isSearching
                ? "Try a different name or spelling"
                : "Check your connection and try again"}
            </p>
          </div>
        )}

        {/* Results grid */}
        {people.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
            {people.map((person) => (
              <button
                key={person.id}
                onClick={() => navigate(`/person/${person.id}`)}
                className="group text-left cursor-pointer"
              >
                <div className="w-full aspect-[2/3] rounded-xl overflow-hidden bg-neutral-900 border border-white/[0.06] transition-all duration-300 group-hover:border-white/25 group-hover:shadow-2xl">
                  <img
                    src={MOVIE_CARD_IMAGE_URL + person.profile_path}
                    alt={person.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="mt-2 text-sm font-semibold truncate group-hover:text-red-400 transition-colors">
                  {person.name}
                </p>
                <p className="text-xs text-gray-500 line-clamp-1">
                  {knownForLine(person)}
                </p>
              </button>
            ))}

            {/* Shimmer while paging */}
            {isLoading &&
              page > 1 &&
              Array(6)
                .fill(0)
                .map((_, i) => <PersonSkeleton key={`sk-${i}`} />)}
          </div>
        )}

        {/* Infinite scroll sentinel */}
        <div ref={loaderRef} className="h-4" />
      </div>
    </div>
  );
};

export default ActorsPage;
