import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import GptMovieCard from "../gptSearch/GptMovieCard";
import { API_GET_OPTIONS } from "../../utils/constants";

const TABS = [
  { label: "Today",     value: "day"  },
  { label: "This Week", value: "week" },
];

const TrendingPage = () => {
  const [activeTab, setActiveTab] = useState("day");
  const [movies, setMovies] = useState({ day: null, week: null });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (movies[activeTab]) return; // already fetched

    const fetchTrending = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/trending/movie/${activeTab}`,
          API_GET_OPTIONS
        );
        const data = await res.json();
        setMovies((prev) => ({
          ...prev,
          [activeTab]: data.results?.filter((m) => m.poster_path) ?? [],
        }));
      } catch {
        setMovies((prev) => ({ ...prev, [activeTab]: [] }));
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, [activeTab]);

  const current = movies[activeTab];

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden pb-20 sm:pb-0">
      <Header />

      <div className="pt-20 sm:pt-24 px-4 sm:px-8 md:px-12 pb-12">

        {/* Page title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C9 7 4 8.5 4 13a8 8 0 0016 0c0-2.5-1.5-4.5-3-6-1 2-2 2.5-3 2.5C15 7.5 12 2 12 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Trending</h1>
            <p className="text-gray-500 text-sm">What everyone is watching right now</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === tab.value
                  ? "bg-white text-black"
                  : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Skeleton */}
        {loading && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
            {Array(18).fill(0).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="w-full aspect-[2/3] rounded-lg bg-white/[0.07] animate-pulse" />
                <div className="h-3 rounded bg-white/[0.07] animate-pulse" />
                <div className="h-3 w-2/3 rounded bg-white/[0.07] animate-pulse" />
              </div>
            ))}
          </div>
        )}

        {/* Grid */}
        {!loading && current?.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
            {current.map((movie, i) => (
              <div key={movie.id} className="relative">
                {i < 3 && (
                  <span className="absolute -top-2 -left-1 z-10 w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-red-600 text-white text-xs font-bold flex items-center justify-center shadow-lg">
                    {i + 1}
                  </span>
                )}
                <GptMovieCard movie={movie} />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && current?.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <p className="text-gray-500 text-base">No trending data available right now</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendingPage;
