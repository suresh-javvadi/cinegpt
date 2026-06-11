import React, { useState, useEffect } from "react";
import MoviesList from "./MoviesList";
import { useSelector, useDispatch } from "react-redux";
import { setBrowseLanguage } from "../../slices/configSlice";
import { API_GET_OPTIONS } from "../../utils/constants";
import RecentlyViewedRow from "./RecentlyViewedRow";

const LANGUAGES = [
  { label: "All", code: "all" },
  { label: "Telugu", code: "te", country: "in" },
  { label: "Hindi", code: "hi", country: "in" },
  { label: "Tamil", code: "ta", country: "in" },
  { label: "Malayalam", code: "ml", country: "in" },
  { label: "Kannada", code: "kn", country: "in" },
  { label: "Korean", code: "ko", country: "kr" },
  { label: "Japanese", code: "ja", country: "jp" },
  { label: "Spanish", code: "es", country: "es" },
  { label: "French", code: "fr", country: "fr" },
];

const REGIONAL_ROWS = [
  { key: "popular", label: "Popular", sort: "popularity.desc", extra: "" },
  {
    key: "topRated",
    label: "Top Rated",
    sort: "vote_average.desc",
    extra: "&vote_count.gte=100",
  },
  {
    key: "recent",
    label: "New",
    sort: "release_date.desc",
    extra: "&vote_count.gte=20",
  },
];

const SecondaryContainer = ({ errors = {} }) => {
  const dispatch = useDispatch();
  const activeLang = useSelector(
    (store) => store.config.browseLanguage ?? "all",
  );
  const allMovies = useSelector((store) => store.movies);
  const [regionalCache, setRegionalCache] = useState({});

  const nowPlayingIds = new Set(
    allMovies.nowPlayingMovies?.map((m) => m.id) ?? [],
  );
  const upcoming =
    allMovies.upcoming?.filter((m) => !nowPlayingIds.has(m.id)) ?? null;

  const activeLangLabel =
    LANGUAGES.find((l) => l.code === activeLang)?.label ?? "";

  useEffect(() => {
    if (activeLang === "all" || regionalCache[activeLang]) return;

    const fetchRegional = async () => {
      const base = `https://api.themoviedb.org/3/discover/movie?with_original_language=${activeLang}&include_adult=false`;
      try {
        const responses = await Promise.all(
          REGIONAL_ROWS.map((row) =>
            fetch(
              `${base}&sort_by=${row.sort}${row.extra}`,
              API_GET_OPTIONS,
            ).then((r) => r.json()),
          ),
        );
        const result = {};
        REGIONAL_ROWS.forEach((row, i) => {
          result[row.key] = responses[i]?.results ?? [];
        });
        setRegionalCache((prev) => ({ ...prev, [activeLang]: result }));
      } catch {
        const empty = {};
        REGIONAL_ROWS.forEach((row) => {
          empty[row.key] = [];
        });
        setRegionalCache((prev) => ({ ...prev, [activeLang]: empty }));
      }
    };

    fetchRegional();
  }, [activeLang]);

  const regional = regionalCache[activeLang];

  return (
    <div className="bg-black px-2 sm:px-4 md:px-6 pb-10">
      {/* Entire section elevated above TopContainer gradient */}
      <div className="-mt-6 sm:-mt-28 md:-mt-40 2xl:-mt-70 relative z-30">
        {/* Language pill bar */}
        <div>
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 px-1 sm:px-0 py-4 sm:py-5 w-max">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => dispatch(setBrowseLanguage(lang.code))}
                  className={`
                  flex-shrink-0 flex items-center gap-1.5
                  px-4 py-1.5 rounded-full text-sm font-medium
                  transition-all duration-200 cursor-pointer whitespace-nowrap
                  ${
                    activeLang === lang.code
                      ? "bg-white text-black shadow-lg scale-105"
                      : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white border border-white/10"
                  }
                `}
                >
                  {lang.country && (
                    <img
                      src={`https://flagcdn.com/w20/${lang.country}.png`}
                      width="16"
                      height="12"
                      alt={lang.label}
                      className="object-cover flex-shrink-0"
                    />
                  )}
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6 sm:space-y-8 pt-2">
          {/* Regional rows — shown first when a language is selected */}
          {activeLang !== "all" &&
            REGIONAL_ROWS.map((row) => (
              <MoviesList
                key={row.key}
                title={`${row.label} ${activeLangLabel} Movies`}
                movies={regional ? regional[row.key] : null}
              />
            ))}

          {/* Recently Viewed */}
          <RecentlyViewedRow />

          {/* Default rows — always shown */}
          <MoviesList
            title="Now Playing"
            movies={allMovies.nowPlayingMovies}
            error={errors.nowPlayingError}
          />
          <MoviesList
            title="Popular Movies"
            movies={allMovies.popularMovies}
            error={errors.popularError}
          />
          <MoviesList
            title="Top Rated Movies"
            movies={allMovies.topRated}
            error={errors.topRatedError}
          />
          <MoviesList
            title="Upcoming Movies"
            movies={upcoming}
            error={errors.upcomingError}
          />
        </div>
      </div>
      {/* end z-30 wrapper */}
    </div>
  );
};

export default SecondaryContainer;
