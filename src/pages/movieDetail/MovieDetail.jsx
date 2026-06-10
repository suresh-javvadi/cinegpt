import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { API_GET_OPTIONS, MOVIE_IMAGE_URL } from "../../utils/constants";

const TMDB_BASE = "https://api.themoviedb.org/3/movie";

const formatMoney = (n) => (n ? `$${(n / 1_000_000).toFixed(1)}M` : null);

const MEDIA_TABS = ["Videos", "Backdrops", "Posters"];

const MediaSection = ({ videos, images }) => {
  const [activeTab, setActiveTab] = useState("Videos");

  const TYPE_ORDER = ["Trailer", "Teaser", "Clip", "Featurette", "Behind the Scenes", "Bloopers"];
  const allVideos = videos
    .filter((v) => v.site === "YouTube")
    .sort((a, b) => {
      if (a.official !== b.official) return a.official ? -1 : 1;
      return TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type);
    });
  const backdrops = images?.backdrops?.slice(0, 20) ?? [];
  const posters = images?.posters?.slice(0, 20) ?? [];

  const counts = { Videos: allVideos.length, Backdrops: backdrops.length, Posters: posters.length };

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
            <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === tab ? "bg-white/15 text-white" : "bg-white/10 text-gray-500"}`}>
              {counts[tab]}
            </span>
          </button>
        ))}
      </div>

      {/* Videos */}
      {activeTab === "Videos" && (
        allVideos.length === 0 ? (
          <p className="text-gray-500 text-sm">No videos available.</p>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
            {allVideos.map((v, i) => {
              const isFeatured = i === 0;
              return (
                <div
                  key={v.id}
                  onClick={() => window.open(`https://www.youtube.com/watch?v=${v.key}`, "_blank")}
                  className={`flex-shrink-0 group cursor-pointer ${isFeatured ? "w-80 sm:w-[28rem]" : "w-64 sm:w-80"}`}
                >
                  <div className={`relative aspect-video rounded-xl overflow-hidden border ${isFeatured ? "border-white/25" : "border-white/10"}`}>
                    <img
                      src={`https://img.youtube.com/vi/${v.key}/${isFeatured ? "maxresdefault" : "hqdefault"}.jpg`}
                      onError={(e) => { e.currentTarget.src = `https://img.youtube.com/vi/${v.key}/hqdefault.jpg`; }}
                      alt={v.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition flex items-center justify-center">
                      <div className={`rounded-full bg-white/90 flex items-center justify-center shadow-lg ${isFeatured ? "w-14 h-14" : "w-12 h-12"}`}>
                        <svg width={isFeatured ? 22 : 18} height={isFeatured ? 22 : 18} fill="black" viewBox="0 0 24 24">
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
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                          Official
                        </span>
                      )}
                    </div>
                  </div>
                  <p className={`text-gray-300 mt-2 truncate ${isFeatured ? "text-sm font-medium" : "text-xs"}`}>{v.name}</p>
                  <p className="text-gray-500 text-xs">{v.type}</p>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* Backdrops */}
      {activeTab === "Backdrops" && (
        backdrops.length === 0 ? (
          <p className="text-gray-500 text-sm">No backdrops available.</p>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
            {backdrops.map((img, i) => (
              <a
                key={i}
                href={`https://image.tmdb.org/t/p/original${img.file_path}`}
                target="_blank"
                rel="noreferrer"
                className="flex-shrink-0 w-64 sm:w-80 aspect-video rounded-xl overflow-hidden border border-white/10 hover:border-white/30 transition"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w780${img.file_path}`}
                  alt={`Backdrop ${i + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </a>
            ))}
          </div>
        )
      )}

      {/* Posters */}
      {activeTab === "Posters" && (
        posters.length === 0 ? (
          <p className="text-gray-500 text-sm">No posters available.</p>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
            {posters.map((img, i) => (
              <a
                key={i}
                href={`https://image.tmdb.org/t/p/original${img.file_path}`}
                target="_blank"
                rel="noreferrer"
                className="flex-shrink-0 w-32 sm:w-40 rounded-xl overflow-hidden border border-white/10 hover:border-white/30 transition"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w342${img.file_path}`}
                  alt={`Poster ${i + 1}`}
                  className="w-full hover:scale-105 transition-transform duration-300"
                />
              </a>
            ))}
          </div>
        )
      )}
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
    year: "numeric", month: "long", day: "numeric",
  });
  const isLong = review.content.length > 400;
  const percent = rating ? Math.round(rating * 10) : null;

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">
      <div className="flex items-start gap-3">
        {avatar ? (
          <img src={avatar} alt={review.author} className="w-11 h-11 rounded-full object-cover border border-white/20 flex-shrink-0" />
        ) : (
          <div className="w-11 h-11 rounded-full bg-gray-700 flex items-center justify-center text-base font-bold text-white flex-shrink-0">
            {review.author?.[0]?.toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-white font-bold text-base">A review by {review.author}</p>
            {percent && (
              <span className="flex items-center gap-1 bg-gray-800 text-white text-xs font-bold px-2 py-0.5 rounded">
                ★ {percent}%
              </span>
            )}
          </div>
          <p className="text-gray-400 text-xs mt-0.5">
            Written by <span className="text-gray-300">{review.author}</span> on {date}
          </p>
        </div>
      </div>
      <p className="text-gray-300 text-sm leading-relaxed">
        {isLong && !expanded ? `${review.content.slice(0, 400)}...` : review.content}
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
    window.scrollTo(0, 0);

    Promise.all([
      fetch(`${TMDB_BASE}/${id}`, API_GET_OPTIONS).then((r) => r.json()),
      fetch(`${TMDB_BASE}/${id}/credits`, API_GET_OPTIONS).then((r) => r.json()),
      fetch(`${TMDB_BASE}/${id}/videos`, API_GET_OPTIONS).then((r) => r.json()),
      fetch(`${TMDB_BASE}/${id}/recommendations`, API_GET_OPTIONS).then((r) => r.json()),
      fetch(`${TMDB_BASE}/${id}/external_ids`, API_GET_OPTIONS).then((r) => r.json()),
      fetch(`${TMDB_BASE}/${id}/reviews`, API_GET_OPTIONS).then((r) => r.json()),
      fetch(`${TMDB_BASE}/${id}/images`, API_GET_OPTIONS).then((r) => r.json()),
    ])
      .then(([movieData, creditsData, videosData, similarData, externalData, reviewsData, imagesData]) => {
        if (!movieData?.title) { setError(true); return; }
        setMovie(movieData);
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
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSkeleton />;

  if (error || !movie) return (
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
    videos?.results?.find((v) => v.type === "Trailer" && v.site === "YouTube") ||
    videos?.results?.[0];
  const director = credits?.crew?.find((c) => c.job === "Director");
  const cast = credits?.cast?.slice(0, 10) ?? [];
  const hours = Math.floor(movie.runtime / 60);
  const mins = movie.runtime % 60;
  const runtime = movie.runtime ? `${hours}h ${mins}m` : null;
  const matchScore = Math.round(movie.vote_average * 10);

  return (
    <div className="min-h-screen bg-[#141414] text-white">
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
          className="absolute top-5 left-5 flex items-center gap-2 bg-black/60 hover:bg-black px-4 py-2 rounded-full text-sm font-medium transition"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M19 12H5M5 12l7-7M5 12l7 7" />
          </svg>
          Back
        </button>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-10 md:px-16 -mt-28 sm:-mt-36 relative z-10">
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-start">
          {/* Poster */}
          {movie.poster_path && (
            <div className="hidden sm:block flex-shrink-0 w-40 md:w-52 rounded-xl overflow-hidden shadow-2xl border border-white/10">
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
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">{movie.title}</h1>
              {movie.original_title && movie.original_title !== movie.title && (
                <p className="text-gray-500 text-sm mt-1">
                  Original title: <span className="text-gray-300 italic">{movie.original_title}</span>
                </p>
              )}
              {movie.tagline && (
                <p className="text-gray-400 italic mt-1 text-base sm:text-lg">{movie.tagline}</p>
              )}
            </div>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="text-green-400 font-bold text-base">{matchScore}% Match</span>
              <span className="text-gray-300">{movie.release_date?.slice(0, 4)}</span>
              {runtime && <span className="text-gray-300">{runtime}</span>}
              <span className="border border-gray-500 text-gray-400 px-2 py-0.5 rounded text-xs">
                {movie.status}
              </span>
              {movie.vote_count > 0 && (
                <span className="text-yellow-400 font-semibold">
                  ⭐ {movie.vote_average?.toFixed(1)}
                  <span className="text-gray-400 font-normal text-xs ml-1">({movie.vote_count?.toLocaleString()} votes)</span>
                </span>
              )}
              {externalIds?.imdb_id && (
                <a
                  href={`https://www.imdb.com/title/${externalIds.imdb_id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 bg-yellow-400 text-black text-xs font-bold px-2.5 py-1 rounded hover:bg-yellow-300 transition cursor-pointer"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 3v4a1 1 0 001 1h4" /><path d="M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" strokeWidth="2" stroke="currentColor" fill="none"/>
                  </svg>
                  IMDb
                </a>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2">
              {movie.genres?.map((g) => (
                <span key={g.id} className="bg-red-600/80 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-full transition">
                  {g.name}
                </span>
              ))}
            </div>

            {/* Overview */}
            <p className="text-gray-200 text-sm sm:text-base leading-relaxed max-w-2xl">{movie.overview}</p>

            {/* Details grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 pt-2 text-sm border-t border-white/10">
              {director && (
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">Director</p>
                  <p className="text-white font-medium">{director.name}</p>
                </div>
              )}
              {movie.original_language && (
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">Original Language</p>
                  <p className="text-white font-medium">
                    {new Intl.DisplayNames(["en"], { type: "language" }).of(movie.original_language)}
                  </p>
                </div>
              )}
              {movie.production_companies?.[0] && (
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">Studio</p>
                  <p className="text-white font-medium">{movie.production_companies[0].name}</p>
                </div>
              )}
              {formatMoney(movie.budget) && (
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">Budget</p>
                  <p className="text-white font-medium">{formatMoney(movie.budget)}</p>
                </div>
              )}
              {formatMoney(movie.revenue) && (
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">Revenue</p>
                  <p className="text-white font-medium">{formatMoney(movie.revenue)}</p>
                </div>
              )}
              {movie.spoken_languages?.length > 0 && (
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">Spoken Languages</p>
                  <p className="text-white font-medium">
                    {movie.spoken_languages.map((l) => l.english_name).join(", ")}
                  </p>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-1">
              {trailer && (
                <button
                  onClick={() => window.open(`https://www.youtube.com/watch?v=${trailer.key}`, "_blank")}
                  className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-lg font-semibold hover:opacity-80 transition"
                >
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Play Trailer
                </button>
              )}
            </div>
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
                <div key={person.id} className="flex-shrink-0 w-24 sm:w-28 text-center">
                  {person.profile_path ? (
                    <img
                      src={`${MOVIE_IMAGE_URL}${person.profile_path}`}
                      alt={person.name}
                      className="w-full aspect-square object-cover rounded-full shadow-lg border-2 border-white/10"
                    />
                  ) : (
                    <div className="w-full aspect-square rounded-full bg-gray-700 flex items-center justify-center text-3xl">
                      👤
                    </div>
                  )}
                  <p className="text-xs font-semibold text-white mt-2 leading-tight">{person.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-tight">{person.character}</p>
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
              <span className="bg-white/15 text-white text-xs px-2 py-0.5 rounded-full">{reviews.length}</span>
            </div>
            <div className="pb-2 text-gray-500 text-sm flex items-center gap-1.5 cursor-default">
              Discussions
              <span className="bg-white/10 text-gray-500 text-xs px-2 py-0.5 rounded-full">0</span>
            </div>
          </div>

          {/* Content */}
          {reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3 text-center border border-white/10 rounded-xl bg-white/5">
              <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="text-gray-600">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              <p className="text-gray-400 font-medium">No reviews yet</p>
              <p className="text-gray-600 text-sm">Be the first to write a review on TMDB.</p>
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

        {/* Similar movies */}
        {similar?.results?.length > 0 && (
          <div className="mt-12 mb-16">
            <h2 className="text-xl font-bold mb-4">More Like This</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
                      <span className="text-xs text-gray-500">{m.release_date?.slice(0, 4)}</span>
                      {m.vote_average > 0 && (
                        <span className="text-xs text-yellow-400">⭐ {m.vote_average?.toFixed(1)}</span>
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

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-[#141414] animate-pulse">
    <div className="w-full h-[65vh] bg-gray-800" />
    <div className="px-4 sm:px-10 md:px-16 -mt-36 relative z-10">
      <div className="flex gap-10 items-start">
        <div className="hidden sm:block w-52 h-72 bg-gray-700 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-4 pt-8">
          <div className="h-10 bg-gray-700 rounded w-2/3" />
          <div className="h-4 bg-gray-700 rounded w-1/3" />
          <div className="flex gap-2">
            <div className="h-6 w-16 bg-gray-700 rounded-full" />
            <div className="h-6 w-20 bg-gray-700 rounded-full" />
            <div className="h-6 w-14 bg-gray-700 rounded-full" />
          </div>
          <div className="h-20 bg-gray-700 rounded w-full max-w-2xl" />
          <div className="h-10 w-36 bg-gray-700 rounded-lg" />
        </div>
      </div>
    </div>
  </div>
);

export default MovieDetail;
