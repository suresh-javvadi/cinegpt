import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { API_GET_OPTIONS, MOVIE_IMAGE_URL } from "../../utils/constants";
import { addRecentlyViewed } from "../../hooks/useRecentlyViewed";
import Header from "../../components/Header";

const TMDB_BASE = "https://api.themoviedb.org/3/movie";

const formatUSD = (n) => (n ? `$${(n / 1_000_000).toFixed(1)}M` : null);

const PROVIDER_URLS = {
  8: (t) => `https://www.netflix.com/search?q=${encodeURIComponent(t)}`,
  9: (t) =>
    `https://www.primevideo.com/search/ref=atv_nb_sr?phrase=${encodeURIComponent(t)}`,
  10: (t) =>
    `https://www.primevideo.com/search/ref=atv_nb_sr?phrase=${encodeURIComponent(t)}`,
  119: (t) =>
    `https://www.primevideo.com/search/ref=atv_nb_sr?phrase=${encodeURIComponent(t)}`,
  122: (t) => `https://www.hotstar.com/in/search?q=${encodeURIComponent(t)}`,
  337: (t) => `https://www.hotstar.com/in/search?q=${encodeURIComponent(t)}`,
  220: (t) => `https://www.jiocinema.com/search/${encodeURIComponent(t)}`,
  237: (t) => `https://www.sonyliv.com/search?keyword=${encodeURIComponent(t)}`,
  350: (t) => `https://tv.apple.com/search?term=${encodeURIComponent(t)}`,
  100: (t) => `https://mubi.com/search/${encodeURIComponent(t)}`,
  232: (t) => `https://www.zee5.com/search?q=${encodeURIComponent(t)}`,
  315: (t) => `https://www.zee5.com/search?q=${encodeURIComponent(t)}`,
  384: (t) => `https://play.max.com/search?q=${encodeURIComponent(t)}`,
  531: (t) => `https://www.paramountplus.com/search/`,
  191: (t) => `https://erosnow.com/search?keyword=${encodeURIComponent(t)}`,
  218: (t) => `https://www.sunnxt.com/search?q=${encodeURIComponent(t)}`,
  425: (t) => `https://www.ahavideo.com/search?q=${encodeURIComponent(t)}`,
  192: (t) =>
    `https://www.youtube.com/results?search_query=${encodeURIComponent(t)}`,
  188: (t) =>
    `https://www.youtube.com/results?search_query=${encodeURIComponent(t)}`,
};

const getProviderUrl = (provider, title, fallback) =>
  PROVIDER_URLS[provider.provider_id]?.(title) ?? fallback;

const MEDIA_TABS = ["Videos", "Backdrops", "Posters"];

const MediaSection = ({ videos, images }) => {
  const [activeTab, setActiveTab] = useState("Videos");

  const TYPE_ORDER = [
    "Trailer",
    "Teaser",
    "Clip",
    "Featurette",
    "Behind the Scenes",
    "Bloopers",
  ];
  const allVideos = videos
    .filter((v) => v.site === "YouTube")
    .sort((a, b) => {
      if (a.official !== b.official) return a.official ? -1 : 1;
      return TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type);
    });
  const backdrops = images?.backdrops?.slice(0, 20) ?? [];
  const posters = images?.posters?.slice(0, 20) ?? [];

  const counts = {
    Videos: allVideos.length,
    Backdrops: backdrops.length,
    Posters: posters.length,
  };

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold mb-4">Media</h2>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-white/10 mb-5">
        {MEDIA_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm flex items-center gap-1.5 transition cursor-pointer border-b-2 ${
              activeTab === tab
                ? "border-white text-white font-semibold"
                : "border-transparent text-gray-500 hover:text-gray-300"
            }`}
          >
            {tab}
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${activeTab === tab ? "bg-white/15 text-white" : "bg-white/10 text-gray-500"}`}
            >
              {counts[tab]}
            </span>
          </button>
        ))}
      </div>

      {/* Videos */}
      {activeTab === "Videos" &&
        (allVideos.length === 0 ? (
          <p className="text-gray-500 text-sm">No videos available.</p>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
            {allVideos.map((v, i) => {
              const isFeatured = i === 0;
              return (
                <a
                  key={v.id}
                  href={`https://www.youtube.com/watch?v=${v.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-shrink-0 group cursor-pointer ${isFeatured ? "w-64 sm:w-80 md:w-[28rem]" : "w-48 sm:w-64 md:w-80"}`}
                >
                  <div
                    className={`relative aspect-video rounded-xl overflow-hidden border ${isFeatured ? "border-white/25" : "border-white/10"}`}
                  >
                    <img
                      src={`https://img.youtube.com/vi/${v.key}/${isFeatured ? "maxresdefault" : "hqdefault"}.jpg`}
                      onError={(e) => {
                        e.currentTarget.src = `https://img.youtube.com/vi/${v.key}/hqdefault.jpg`;
                      }}
                      alt={v.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition flex items-center justify-center">
                      <div
                        className={`rounded-full bg-white/90 flex items-center justify-center shadow-lg ${isFeatured ? "w-14 h-14" : "w-12 h-12"}`}
                      >
                        <svg
                          width={isFeatured ? 22 : 18}
                          height={isFeatured ? 22 : 18}
                          fill="black"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex gap-1.5">
                      {isFeatured && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600 text-white tracking-wide">
                          FEATURED
                        </span>
                      )}
                      {v.official && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-white flex items-center gap-1">
                          <svg
                            width="9"
                            height="9"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                          </svg>
                          Official
                        </span>
                      )}
                    </div>
                  </div>
                  <p
                    className={`text-gray-300 mt-2 truncate ${isFeatured ? "text-sm font-medium" : "text-xs"}`}
                  >
                    {v.name}
                  </p>
                  <p className="text-gray-500 text-xs">{v.type}</p>
                </a>
              );
            })}
          </div>
        ))}

      {/* Backdrops */}
      {activeTab === "Backdrops" &&
        (backdrops.length === 0 ? (
          <p className="text-gray-500 text-sm">No backdrops available.</p>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
            {backdrops.map((img, i) => (
              <a
                key={i}
                href={`https://image.tmdb.org/t/p/original${img.file_path}`}
                target="_blank"
                rel="noreferrer"
                className="flex-shrink-0 w-56 sm:w-72 md:w-80 aspect-video rounded-xl overflow-hidden border border-white/10 hover:border-white/30 transition"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w780${img.file_path}`}
                  alt={`Backdrop ${i + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </a>
            ))}
          </div>
        ))}

      {/* Posters */}
      {activeTab === "Posters" &&
        (posters.length === 0 ? (
          <p className="text-gray-500 text-sm">No posters available.</p>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
            {posters.map((img, i) => (
              <a
                key={i}
                href={`https://image.tmdb.org/t/p/original${img.file_path}`}
                target="_blank"
                rel="noreferrer"
                className="flex-shrink-0 w-28 sm:w-36 md:w-40 rounded-xl overflow-hidden border border-white/10 hover:border-white/30 transition"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w342${img.file_path}`}
                  alt={`Poster ${i + 1}`}
                  className="w-full hover:scale-105 transition-transform duration-300"
                />
              </a>
            ))}
          </div>
        ))}
    </div>
  );
};

const ReviewCard = ({ review }) => {
  const [expanded, setExpanded] = useState(false);
  const rating = review.author_details?.rating;
  const avatarPath = review.author_details?.avatar_path;
  const avatar = avatarPath?.startsWith("/https")
    ? avatarPath.slice(1)
    : avatarPath
      ? `${MOVIE_IMAGE_URL}${avatarPath}`
      : null;
  const date = new Date(review.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const isLong = review.content.length > 400;
  const percent = rating ? Math.round(rating * 10) : null;

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">
      <div className="flex items-start gap-3">
        {avatar ? (
          <img
            src={avatar}
            alt={review.author}
            className="w-11 h-11 rounded-full object-cover border border-white/20 flex-shrink-0"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-gray-700 flex items-center justify-center text-base font-bold text-white flex-shrink-0">
            {review.author?.[0]?.toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-white font-bold text-base">
              A review by {review.author}
            </p>
            {percent && (
              <span className="flex items-center gap-1 bg-gray-800 text-white text-xs font-bold px-2 py-0.5 rounded">
                ★ {percent}%
              </span>
            )}
          </div>
          <p className="text-gray-400 text-xs mt-0.5">
            Written by <span className="text-gray-300">{review.author}</span> on{" "}
            {date}
          </p>
        </div>
      </div>
      <p className="text-gray-300 text-sm leading-relaxed">
        {isLong && !expanded
          ? `${review.content.slice(0, 400)}...`
          : review.content}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-red-400 hover:text-red-300 cursor-pointer transition"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
};

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [videos, setVideos] = useState(null);
  const [images, setImages] = useState(null);
  const [similar, setSimilar] = useState(null);
  const [externalIds, setExternalIds] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [franchise, setFranchise] = useState(null);
  const [watchProviders, setWatchProviders] = useState(null);
  const [certification, setCertification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    setMovie(null);
    setCredits(null);
    setVideos(null);
    setImages(null);
    setSimilar(null);
    setExternalIds(null);
    setReviews([]);
    setFranchise(null);
    setWatchProviders(null);
    setCertification(null);

    Promise.all([
      fetch(`${TMDB_BASE}/${id}`, API_GET_OPTIONS).then((r) => r.json()),
      fetch(`${TMDB_BASE}/${id}/credits`, API_GET_OPTIONS).then((r) =>
        r.json(),
      ),
      fetch(`${TMDB_BASE}/${id}/videos`, API_GET_OPTIONS).then((r) => r.json()),
      fetch(`${TMDB_BASE}/${id}/recommendations`, API_GET_OPTIONS).then((r) =>
        r.json(),
      ),
      fetch(`${TMDB_BASE}/${id}/external_ids`, API_GET_OPTIONS).then((r) =>
        r.json(),
      ),
      fetch(`${TMDB_BASE}/${id}/reviews`, API_GET_OPTIONS).then((r) =>
        r.json(),
      ),
      fetch(`${TMDB_BASE}/${id}/images`, API_GET_OPTIONS).then((r) => r.json()),
      fetch(`${TMDB_BASE}/${id}/watch/providers`, API_GET_OPTIONS).then((r) =>
        r.json(),
      ),
      fetch(`${TMDB_BASE}/${id}/release_dates`, API_GET_OPTIONS).then((r) =>
        r.json(),
      ),
    ])
      .then(
        ([
          movieData,
          creditsData,
          videosData,
          similarData,
          externalData,
          reviewsData,
          imagesData,
          watchData,
          releaseDatesData,
        ]) => {
          if (!movieData?.title) {
            setError(true);
            return;
          }
          setMovie(movieData);
          addRecentlyViewed(movieData);
          setCredits(creditsData);
          setVideos(videosData);
          setImages(imagesData);
          // recommendations is more relevant; fall back to similar if empty
          if (similarData?.results?.length > 0) {
            setSimilar(similarData);
          } else {
            fetch(`${TMDB_BASE}/${id}/similar`, API_GET_OPTIONS)
              .then((r) => r.json())
              .then((d) => setSimilar(d));
          }
          setExternalIds(externalData);
          setReviews(reviewsData?.results ?? []);

          // Watch providers — prefer India, skip if empty
          const inProviders = watchData?.results?.IN ?? null;
          if (inProviders?.flatrate?.length || inProviders?.rent?.length) {
            setWatchProviders(inProviders);
          }

          // Certification — prefer India (CBFC), fallback to US
          const findCert = (iso) =>
            releaseDatesData?.results
              ?.find((r) => r.iso_3166_1 === iso)
              ?.release_dates?.find((d) => d.certification)?.certification ??
            null;
          setCertification(findCert("IN") || findCert("US"));

          if (movieData.belongs_to_collection?.id) {
            fetch(
              `https://api.themoviedb.org/3/collection/${movieData.belongs_to_collection.id}`,
              API_GET_OPTIONS,
            )
              .then((r) => r.json())
              .then((d) => {
                if (d?.parts) setFranchise(d);
              })
              .catch(() => {});
          }
        },
      )
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSkeleton />;

  if (error || !movie)
    return (
      <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center gap-4 text-white">
        <p className="text-xl font-semibold">Something went wrong</p>
        <p className="text-gray-400 text-sm">Could not load movie details.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-2 px-5 py-2 bg-white text-black rounded-lg font-semibold hover:opacity-80 transition cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );

  const trailer =
    videos?.results?.find(
      (v) => v.type === "Trailer" && v.site === "YouTube",
    ) || videos?.results?.[0];
  const director = credits?.crew?.find((c) => c.job === "Director");
  const writer = credits?.crew?.find((c) =>
    ["Screenplay", "Writer", "Story"].includes(c.job),
  );
  const composer = credits?.crew?.find(
    (c) => c.job === "Original Music Composer",
  );
  const dop = credits?.crew?.find((c) => c.job === "Director of Photography");
  const cast = credits?.cast?.slice(0, 10) ?? [];
  const hours = Math.floor(movie.runtime / 60);
  const mins = movie.runtime % 60;
  const runtime = movie.runtime ? `${hours}h ${mins}m` : null;
  const matchScore = Math.round(movie.vote_average * 10);
  const profit =
    movie.budget > 0 && movie.revenue > 0 ? movie.revenue - movie.budget : null;

  return (
    <div className="min-h-screen bg-[#141414] text-white pb-20 sm:pb-0">
      <Header />
      {/* Backdrop */}
      <div className="relative w-full h-[55vh] sm:h-[65vh] md:h-[75vh]">
        {movie.backdrop_path && (
          <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/70 to-transparent" />

        <button
          onClick={() => navigate(-1)}
          className="hidden sm:flex absolute top-20 left-5 items-center gap-2 bg-black/60 hover:bg-black px-4 py-2 rounded-full text-sm font-medium transition z-50"
        >
          <svg
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path d="M19 12H5M5 12l7-7M5 12l7 7" />
          </svg>
          Back
        </button>
      </div>

      {/* Content */}
      <div className="px-3 sm:px-8 md:px-16 -mt-20 sm:-mt-32 md:-mt-40 relative z-10 pb-20">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 md:gap-10 items-start">
          {/* Poster */}
          {movie.poster_path && (
            <div className="hidden sm:block flex-shrink-0 w-36 md:w-48 lg:w-52 rounded-xl overflow-hidden shadow-2xl border border-white/10">
              <img
                src={`${MOVIE_IMAGE_URL}${movie.poster_path}`}
                alt={movie.title}
                className="w-full"
              />
            </div>
          )}

          {/* Info */}
          <div className="flex-1 space-y-4 pt-2">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                {movie.title}
              </h1>
              {movie.original_title && movie.original_title !== movie.title && (
                <p className="text-gray-500 text-sm mt-1">
                  Original title:{" "}
                  <span className="text-gray-300 italic">
                    {movie.original_title}
                  </span>
                </p>
              )}
              {movie.tagline && (
                <p className="text-gray-400 italic mt-1 text-base sm:text-lg">
                  {movie.tagline}
                </p>
              )}
            </div>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="text-green-400 font-bold text-base">
                {matchScore}% Match
              </span>
              <span className="text-gray-300">
                {movie.release_date?.slice(0, 4)}
              </span>
              {runtime && <span className="text-gray-300">{runtime}</span>}
              {certification && (
                <span
                  className={`border px-2 py-0.5 rounded text-xs font-semibold ${
                    ["A", "R", "NC-17"].includes(certification)
                      ? "border-red-500 text-red-400"
                      : certification.startsWith("U/A 1") ||
                          certification === "PG-13"
                        ? "border-orange-500 text-orange-400"
                        : "border-yellow-500/70 text-yellow-400"
                  }`}
                >
                  {certification}
                </span>
              )}
              <span className="border border-gray-500 text-gray-400 px-2 py-0.5 rounded text-xs">
                {movie.status}
              </span>
              {movie.vote_count > 0 && (
                <span className="text-yellow-400 font-semibold">
                  ⭐ {movie.vote_average?.toFixed(1)}
                  <span className="text-gray-400 font-normal text-xs ml-1">
                    ({movie.vote_count?.toLocaleString()} votes)
                  </span>
                </span>
              )}
              {externalIds?.imdb_id && (
                <a
                  href={`https://www.imdb.com/title/${externalIds.imdb_id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 bg-yellow-400 text-black text-xs font-bold px-2.5 py-1 rounded hover:bg-yellow-300 transition cursor-pointer"
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M14 3v4a1 1 0 001 1h4" />
                    <path
                      d="M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z"
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="none"
                    />
                  </svg>
                  IMDb
                </a>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2">
              {movie.genres?.map((g) => (
                <button
                  key={g.id}
                  onClick={() =>
                    navigate(`/genre/${g.id}/${encodeURIComponent(g.name)}`)
                  }
                  className="group flex items-center gap-1 bg-red-600/20 hover:bg-red-600 border border-red-600/50 hover:border-red-600 text-red-400 hover:text-white text-xs px-3 py-1 rounded-full transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
                >
                  {g.name}
                  <svg
                    width="10"
                    height="10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                    className="opacity-50 group-hover:opacity-100 transition-opacity"
                  >
                    <path
                      d="M9 18l6-6-6-6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              ))}
            </div>

            {/* Overview */}
            <p className="text-gray-200 text-sm sm:text-base leading-relaxed max-w-2xl">
              {movie.overview}
            </p>

            {/* Details grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4 pt-3 text-sm border-t border-white/10">
              {director && (
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">
                    Director
                  </p>
                  <p className="text-white font-medium">{director.name}</p>
                </div>
              )}
              {writer && (
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">
                    Screenplay
                  </p>
                  <p className="text-white font-medium">{writer.name}</p>
                </div>
              )}
              {composer && (
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">
                    Music
                  </p>
                  <p className="text-white font-medium">{composer.name}</p>
                </div>
              )}
              {dop && (
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">
                    Cinematography
                  </p>
                  <p className="text-white font-medium">{dop.name}</p>
                </div>
              )}
              {movie.original_language && (
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">
                    Language
                  </p>
                  <p className="text-white font-medium">
                    {new Intl.DisplayNames(["en"], { type: "language" }).of(
                      movie.original_language,
                    )}
                  </p>
                </div>
              )}
              {movie.production_countries?.[0] && (
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">
                    Country
                  </p>
                  <p className="text-white font-medium">
                    {movie.production_countries[0].name}
                  </p>
                </div>
              )}
              {movie.production_companies?.[0] && (
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">
                    Studio
                  </p>
                  <p className="text-white font-medium">
                    {movie.production_companies[0].name}
                  </p>
                </div>
              )}
              {formatUSD(movie.budget) && (
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">
                    Budget
                  </p>
                  <p className="text-white font-medium">
                    {formatUSD(movie.budget)}
                  </p>
                </div>
              )}
              {formatUSD(movie.revenue) && (
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">
                    Box Office
                  </p>
                  <p className="text-white font-medium">
                    {formatUSD(movie.revenue)}
                  </p>
                </div>
              )}
              {profit !== null && (
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">
                    Profit / Loss
                  </p>
                  <p
                    className={`font-medium ${profit >= 0 ? "text-green-400" : "text-red-400"}`}
                  >
                    {profit >= 0 ? "+" : ""}
                    {formatUSD(profit)}
                  </p>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-1">
              {trailer && (
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white text-black px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold text-sm sm:text-base hover:opacity-80 active:scale-95 transition cursor-pointer"
                >
                  <svg
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="sm:w-[18px] sm:h-[18px]"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Play Trailer
                </a>
              )}
            </div>

            {/* Where to Watch */}
            {watchProviders && (
              <div className="pt-1">
                <div className="flex items-center gap-2 mb-2.5">
                  <img
                    src="https://flagcdn.com/w20/in.png"
                    width="16"
                    height="12"
                    alt="India"
                  />
                  <p className="text-gray-400 text-xs uppercase tracking-wider">
                    Where to Watch in India
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {watchProviders.flatrate?.map((p) => (
                    <a
                      key={p.provider_id}
                      href={getProviderUrl(p, movie.title, watchProviders.link)}
                      target="_blank"
                      rel="noreferrer"
                      title={`Stream on ${p.provider_name}`}
                      className="flex items-center gap-2 bg-white/8 hover:bg-white/15 border border-white/10 hover:border-white/30 rounded-xl px-3 py-2 transition cursor-pointer"
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/w45${p.logo_path}`}
                        alt={p.provider_name}
                        className="w-6 h-6 rounded-md object-cover flex-shrink-0"
                      />
                      <span className="text-white text-xs font-medium">
                        {p.provider_name}
                      </span>
                      <span className="text-[10px] text-green-400 font-semibold bg-green-400/10 px-1.5 py-0.5 rounded-full">
                        Stream
                      </span>
                    </a>
                  ))}
                  {watchProviders.rent?.map((p) => (
                    <a
                      key={`rent-${p.provider_id}`}
                      href={getProviderUrl(p, movie.title, watchProviders.link)}
                      target="_blank"
                      rel="noreferrer"
                      title={`Rent on ${p.provider_name}`}
                      className="flex items-center gap-2 bg-white/8 hover:bg-white/15 border border-white/10 hover:border-white/30 rounded-xl px-3 py-2 transition cursor-pointer"
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/w45${p.logo_path}`}
                        alt={p.provider_name}
                        className="w-6 h-6 rounded-md object-cover flex-shrink-0"
                      />
                      <span className="text-white text-xs font-medium">
                        {p.provider_name}
                      </span>
                      <span className="text-[10px] text-yellow-400 font-semibold bg-yellow-400/10 px-1.5 py-0.5 rounded-full">
                        Rent
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Embedded trailer */}
        {trailer && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-4">Trailer</h2>
            <div className="w-full max-w-3xl aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/10">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title="Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Cast */}
        {cast.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-4">Top Cast</h2>
            <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
              {cast.map((person) => (
                <div
                  key={person.id}
                  onClick={() => navigate(`/person/${person.id}`)}
                  className="flex-shrink-0 w-20 sm:w-24 md:w-28 text-center cursor-pointer group"
                >
                  {person.profile_path ? (
                    <img
                      src={`${MOVIE_IMAGE_URL}${person.profile_path}`}
                      alt={person.name}
                      className="w-full aspect-square object-cover rounded-full shadow-lg border-2 border-white/10 transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full aspect-square rounded-full bg-gray-700 flex items-center justify-center text-3xl transition-transform duration-300 group-hover:scale-105">
                      👤
                    </div>
                  )}
                  <p className="text-xs font-semibold text-white mt-2 leading-tight group-hover:text-purple-300 transition-colors">
                    {person.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-tight">
                    {person.character}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Media */}
        <MediaSection videos={videos?.results ?? []} images={images} />

        {/* Social / Reviews */}
        <div className="mt-12">
          {/* Header */}
          <h2 className="text-xl font-bold mb-4">Social</h2>

          {/* Tabs */}
          <div className="flex items-center gap-6 border-b border-white/10 mb-5">
            <div className="pb-2 border-b-2 border-white text-white font-semibold text-sm cursor-default flex items-center gap-1.5">
              Reviews
              <span className="bg-white/15 text-white text-xs px-2 py-0.5 rounded-full">
                {reviews.length}
              </span>
            </div>
            <div className="pb-2 text-gray-500 text-sm flex items-center gap-1.5 cursor-default">
              Discussions
              <span className="bg-white/10 text-gray-500 text-xs px-2 py-0.5 rounded-full">
                0
              </span>
            </div>
          </div>

          {/* Content */}
          {reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3 text-center border border-white/10 rounded-xl bg-white/5">
              <svg
                width="36"
                height="36"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                className="text-gray-600"
              >
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              <p className="text-gray-400 font-medium">No reviews yet</p>
              <p className="text-gray-600 text-sm">
                Be the first to write a review on TMDB.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.slice(0, 5).map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
              {externalIds?.imdb_id && (
                <a
                  href={`https://www.imdb.com/title/${externalIds.imdb_id}/reviews`}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-sm text-white/70 hover:text-white font-semibold underline underline-offset-2 cursor-pointer transition mt-2"
                >
                  Read All Reviews
                </a>
              )}
            </div>
          )}
        </div>

        {/* Collections / Franchise */}
        {franchise && franchise.parts?.length > 1 && (
          <div className="mt-12">
            <div className="flex items-center gap-3 mb-1">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-purple-400 flex-shrink-0"
              >
                <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
              </svg>
              <h2 className="text-xl font-bold">Part of: {franchise.name}</h2>
            </div>
            <p className="text-gray-500 text-sm mb-4 ml-7">
              {franchise.parts.length} movies in this collection
            </p>
            <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
              {franchise.parts
                .filter((p) => p.poster_path)
                .sort(
                  (a, b) => new Date(a.release_date) - new Date(b.release_date),
                )
                .map((p) => (
                  <div
                    key={p.id}
                    onClick={() =>
                      p.id !== movie.id && navigate(`/movie/${p.id}`)
                    }
                    className={`flex-shrink-0 w-28 sm:w-36 group ${p.id === movie.id ? "cursor-default" : "cursor-pointer"}`}
                  >
                    <div
                      className={`relative rounded-xl overflow-hidden border-2 transition ${
                        p.id === movie.id
                          ? "border-purple-500"
                          : "border-white/10 group-hover:border-white/40"
                      }`}
                    >
                      <img
                        src={`${MOVIE_IMAGE_URL}${p.poster_path}`}
                        alt={p.title}
                        className={`w-full transition-transform duration-300 ${p.id !== movie.id ? "group-hover:scale-105" : ""}`}
                      />
                      {p.id === movie.id && (
                        <div className="absolute bottom-0 inset-x-0 bg-purple-600/80 flex items-center justify-center py-1">
                          <span className="text-white text-[10px] font-bold tracking-wide uppercase">
                            Watching
                          </span>
                        </div>
                      )}
                    </div>
                    <p
                      className={`text-xs mt-2 font-medium leading-tight line-clamp-2 transition ${
                        p.id === movie.id
                          ? "text-purple-300"
                          : "text-gray-300 group-hover:text-white"
                      }`}
                    >
                      {p.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {p.release_date?.slice(0, 4)}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Similar movies */}
        {similar?.results?.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-4">More Like This</h2>
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
              {similar.results
                .filter((m) => m.poster_path)
                .slice(0, 10)
                .map((m) => (
                  <div
                    key={m.id}
                    onClick={() => navigate(`/movie/${m.id}`)}
                    className="cursor-pointer group"
                  >
                    <div className="overflow-hidden rounded-lg border border-white/10">
                      <img
                        src={`${MOVIE_IMAGE_URL}${m.poster_path}`}
                        alt={m.title}
                        className="w-full group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <p className="text-sm mt-2 text-gray-300 group-hover:text-white transition truncate font-medium">
                      {m.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-500">
                        {m.release_date?.slice(0, 4)}
                      </span>
                      {m.vote_average > 0 && (
                        <span className="text-xs text-yellow-400">
                          ⭐ {m.vote_average?.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Bone = ({ className }) => (
  <div className={`bg-white/[0.07] rounded-lg animate-pulse ${className}`} />
);

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-[#141414] text-white">
    <Header />

    {/* Backdrop */}
    <div className="relative w-full h-[55vh] sm:h-[65vh] md:h-[75vh] bg-neutral-900 animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent" />
    </div>

    {/* Content */}
    <div className="px-3 sm:px-8 md:px-16 -mt-20 sm:-mt-32 md:-mt-40 relative z-10 pb-20">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 md:gap-10 items-start">
        {/* Poster */}
        <Bone className="hidden sm:block flex-shrink-0 w-36 md:w-48 lg:w-52 aspect-[2/3] rounded-xl" />

        {/* Info */}
        <div className="flex-1 space-y-5 pt-2">
          <div className="space-y-2">
            <Bone className="h-9 sm:h-11 md:h-14 w-3/4" />
            <Bone className="h-4 w-2/5" />
          </div>

          <div className="flex gap-2 flex-wrap">
            {[72, 56, 64, 48, 80].map((w, i) => (
              <div
                key={i}
                style={{ width: w }}
                className="h-6 bg-white/[0.07] rounded-full animate-pulse"
              />
            ))}
          </div>

          <div className="flex gap-2 flex-wrap">
            {[68, 80, 60].map((w, i) => (
              <div
                key={i}
                style={{ width: w }}
                className="h-7 bg-white/[0.07] rounded-full animate-pulse"
              />
            ))}
          </div>

          <div className="space-y-2 max-w-2xl">
            <Bone className="h-4 w-full" />
            <Bone className="h-4 w-11/12" />
            <Bone className="h-4 w-5/6" />
            <Bone className="h-4 w-4/5" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4 pt-3 border-t border-white/5">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <Bone className="h-3 w-16" />
                  <Bone className="h-4 w-28" />
                </div>
              ))}
          </div>

          <Bone className="h-10 w-36" />
        </div>
      </div>

      {/* Cast */}
      <div className="mt-12">
        <Bone className="h-6 w-24 mb-5" />
        <div className="flex gap-4 overflow-hidden">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-20 sm:w-24 space-y-2 text-center"
              >
                <Bone className="w-full aspect-square rounded-full" />
                <Bone className="h-3 w-full mx-auto" />
                <Bone className="h-3 w-2/3 mx-auto" />
              </div>
            ))}
        </div>
      </div>

      {/* Media */}
      <div className="mt-12">
        <Bone className="h-6 w-16 mb-4" />
        <div className="flex gap-6 border-b border-white/5 mb-5 pb-2">
          {[60, 72, 56].map((w, i) => (
            <div
              key={i}
              style={{ width: w }}
              className="h-4 bg-white/[0.07] rounded animate-pulse"
            />
          ))}
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[true, false, false, false].map((featured, i) => (
            <Bone
              key={i}
              className={`flex-shrink-0 aspect-video rounded-xl ${featured ? "w-64 sm:w-[28rem]" : "w-48 sm:w-80"}`}
            />
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-12">
        <Bone className="h-6 w-20 mb-5" />
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white/[0.04] border border-white/8 rounded-xl p-5 space-y-3"
            >
              <div className="flex gap-3 items-start">
                <Bone className="w-11 h-11 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Bone className="h-4 w-48" />
                  <Bone className="h-3 w-32" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Bone className="h-3 w-full" />
                <Bone className="h-3 w-11/12" />
                <Bone className="h-3 w-4/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default MovieDetail;
