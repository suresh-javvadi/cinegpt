import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import Header from "../../components/Header";
import {
  API_GET_OPTIONS,
  MOVIE_IMAGE_URL,
  MOVIE_CARD_IMAGE_URL,
} from "../../utils/constants";

const PBone = ({ className }) => (
  <div className={`bg-white/[0.07] rounded-lg animate-pulse ${className}`} />
);

const PersonSkeleton = () => (
  <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
    <Header />
    <div className="pt-20 sm:pt-24 px-4 sm:px-8 md:px-12 xl:px-16 2xl:px-24 pb-16 max-w-[1600px] mx-auto">

      {/* Profile section */}
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 mb-10">
        {/* Photo */}
        <PBone className="w-36 sm:w-48 md:w-56 2xl:w-72 aspect-[2/3] rounded-2xl flex-shrink-0" />

        {/* Info */}
        <div className="flex-1 space-y-4 pt-1">
          <PBone className="h-3 w-24" />
          <PBone className="h-10 sm:h-12 md:h-14 2xl:h-16 w-3/5" />

          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <PBone className="h-4 w-44" />
            <PBone className="h-4 w-36" />
          </div>

          <div className="space-y-2 max-w-4xl">
            <PBone className="h-4 w-full" />
            <PBone className="h-4 w-11/12" />
            <PBone className="h-4 w-5/6" />
            <PBone className="h-4 w-4/5" />
            <PBone className="h-4 w-11/12" />
            <PBone className="h-4 w-3/4" />
          </div>

          <PBone className="h-4 w-20 mt-1" />
        </div>
      </div>

      {/* Filmography grid */}
      <PBone className="h-6 w-40 mb-5" />
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-3 sm:gap-4 2xl:gap-5">
        {Array(16).fill(0).map((_, i) => (
          <div key={i} className="space-y-2">
            <PBone className="w-full aspect-[2/3] rounded-lg" />
            <PBone className="h-3 w-full" />
            <PBone className="h-3 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Credit kinds. Directors and writers reach this page from the actors list, so crew
// credits sit on the same timeline as acting ones — each kind gets its own chip.
const CREDIT_KINDS = [
  { key: "film", label: "Films" },
  { key: "director", label: "Director" },
  { key: "writer", label: "Writer" },
  { key: "producer", label: "Producer" },
  { key: "crew", label: "Crew" },
  { key: "narrator", label: "Narration" },
  { key: "self", label: "As Self" },
  { key: "uncredited", label: "Uncredited" },
  { key: "archive", label: "Archive" },
];

const castKind = (character) => {
  const role = (character || "").toLowerCase();
  if (role.includes("narrator")) return "narrator";
  if (
    role.startsWith("self") ||
    role.includes("himself") ||
    role.includes("herself") ||
    role.includes("themselves")
  )
    return "self";
  if (role.includes("uncredited")) return "uncredited";
  if (role.includes("archive footage")) return "archive";
  return "film";
};

const crewKind = (job) => {
  const role = (job || "").toLowerCase();
  if (role.includes("director") && !role.includes("art")) return "director";
  if (
    role.includes("writer") ||
    role.includes("screenplay") ||
    role.includes("story")
  )
    return "writer";
  if (role.includes("producer")) return "producer";
  return "crew";
};

// One credit on the timeline — a wide row so a year with a single film still fills
// the column, using the character and overview already present in the credits payload
const TimelineFilm = ({ movie }) => {
  const navigate = useNavigate();
  const rating = movie.vote_average
    ? (Math.round(movie.vote_average * 10) / 10).toFixed(1)
    : null;
  const released = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <button
      onClick={() => navigate(`/movie/${movie.id}`)}
      className="group flex gap-3 sm:gap-4 text-left rounded-2xl p-3 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/15 transition-all duration-300 cursor-pointer"
    >
      <img
        src={MOVIE_CARD_IMAGE_URL + movie.poster_path}
        alt={movie.title}
        loading="lazy"
        decoding="async"
        className="w-16 sm:w-20 aspect-[2/3] object-cover rounded-lg flex-shrink-0 shadow-lg transition-transform duration-300 group-hover:scale-[1.04]"
      />

      <div className="flex-1 min-w-0 py-0.5">
        <div className="flex items-start gap-2">
          <h4 className="font-semibold text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-red-400 transition-colors">
            {movie.title}
          </h4>
          {rating && (
            <span className="ml-auto flex-shrink-0 text-xs text-yellow-400 font-medium">
              ★ {rating}
            </span>
          )}
        </div>

        {movie.role && (
          <p className="text-xs text-gray-400 mt-1 line-clamp-1">
            {movie.isCast ? `as ${movie.role}` : movie.role}
          </p>
        )}
        {released && (
          <p className="text-[11px] text-gray-600 mt-0.5">{released}</p>
        )}
        {movie.overview && (
          <p className="hidden sm:block text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
            {movie.overview}
          </p>
        )}
      </div>
    </button>
  );
};

const PersonPage = () => {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [credits, setCredits] = useState(null);
  const [bioExpanded, setBioExpanded] = useState(false);
  const [creditFilter, setCreditFilter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerson = async () => {
      setLoading(true);
      try {
        const [personRes, creditsRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/person/${id}?language=en-US`, API_GET_OPTIONS),
          fetch(`https://api.themoviedb.org/3/person/${id}/movie_credits?language=en-US`, API_GET_OPTIONS),
        ]);
        const [personData, creditsData] = await Promise.all([
          personRes.json(),
          creditsRes.json(),
        ]);
        setPerson(personData);
        setCredits(creditsData);
      } catch {
        // silently fail — UI handles null state
      } finally {
        setLoading(false);
      }
    };
    fetchPerson();
  }, [id]);

  // Cast and crew on one list. A person can both act in and direct the same film, so
  // entries are keyed by kind + film rather than film alone — that keeps the credit
  // visible under both chips instead of one silently swallowing the other.
  const allCredits = [
    ...(credits?.cast ?? []).map((c) => ({
      ...c,
      role: c.character,
      isCast: true,
      kind: castKind(c.character),
    })),
    ...(credits?.crew ?? []).map((c) => ({
      ...c,
      role: c.job,
      isCast: false,
      kind: crewKind(c.job),
    })),
  ].filter((c) => c.poster_path);

  const movies = Object.values(
    allCredits.reduce((acc, m) => {
      const key = `${m.kind}-${m.id}`;
      const seen = acc[key];
      if (!seen) return { ...acc, [key]: m };
      // credited more than once in the same capacity — one card, roles combined
      const roles = [...new Set([seen.role, m.role].filter(Boolean))].join(" / ");
      return { ...acc, [key]: { ...seen, role: roles } };
    }, {}),
  ).sort((a, b) => (b.release_date || "").localeCompare(a.release_date || ""));

  const kindCounts = movies.reduce(
    (acc, m) => ({ ...acc, [m.kind]: (acc[m.kind] ?? 0) + 1 }),
    {},
  );
  // Only offer a chip for a kind this person actually has
  const availableKinds = CREDIT_KINDS.filter((k) => kindCounts[k.key] > 0);

  // No explicit pick yet — open on whichever kind this person has most of, so a
  // director does not land on an empty "Films" tab
  const defaultKind = availableKinds.reduce(
    (best, k) => (kindCounts[k.key] > (kindCounts[best?.key] ?? 0) ? k : best),
    availableKinds[0],
  )?.key;
  const activeKind = creditFilter ?? defaultKind;

  const visibleMovies =
    activeKind === "all" ? movies : movies.filter((m) => m.kind === activeKind);

  // Bucket the (already newest-first) list by release year for the timeline
  const timeline = visibleMovies.reduce((acc, movie) => {
    const year = movie.release_date?.slice(0, 4) || "TBA";
    const last = acc[acc.length - 1];
    if (last && last[0] === year) last[1].push(movie);
    else acc.push([year, [movie]]);
    return acc;
  }, []);

  const releaseYears = visibleMovies
    .map((m) => m.release_date?.slice(0, 4))
    .filter(Boolean);
  const careerSpan =
    releaseYears.length > 1
      ? `${releaseYears[releaseYears.length - 1]} — ${releaseYears[0]}`
      : releaseYears[0];

  const bio = person?.biography;
  const bioShort = bio?.length > 400;
  const displayBio = bioShort && !bioExpanded ? bio?.slice(0, 400) + "…" : bio;

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });
  };

  if (loading) return <PersonSkeleton />;

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      <Header />

      {!loading && person && (
        <div className="pt-20 sm:pt-24 px-4 sm:px-8 md:px-12 xl:px-16 2xl:px-24 pb-16 max-w-[1600px] mx-auto">

          {/* Profile section */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 mb-10">

            {/* Photo */}
            <div className="flex-shrink-0 self-start">
              {person.profile_path ? (
                <img
                  src={MOVIE_IMAGE_URL + person.profile_path}
                  alt={person.name}
                  className="w-36 sm:w-48 md:w-56 2xl:w-72 rounded-2xl object-cover shadow-2xl border border-white/10"
                />
              ) : (
                <div className="w-36 sm:w-48 md:w-56 2xl:w-72 aspect-[2/3] rounded-2xl bg-gray-800 flex items-center justify-center text-5xl">
                  👤
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">
                {person.known_for_department ?? "Actor"}
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl 2xl:text-6xl font-bold mb-3 leading-tight">
                {person.name}
              </h1>

              {/* Meta row */}
              <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-400 mb-5">
                {person.birthday && (
                  <span>Born {formatDate(person.birthday)}</span>
                )}
                {person.deathday && (
                  <span className="text-gray-500">Died {formatDate(person.deathday)}</span>
                )}
                {person.place_of_birth && (
                  <span>{person.place_of_birth}</span>
                )}
              </div>

              {/* Biography */}
              {bio ? (
                <div>
                  <p className="text-gray-300 text-sm sm:text-base 2xl:text-lg leading-relaxed max-w-4xl">{displayBio}</p>
                  {bioShort && (
                    <button
                      onClick={() => setBioExpanded((v) => !v)}
                      className="mt-2 text-purple-400 hover:text-purple-300 text-sm font-medium transition cursor-pointer"
                    >
                      {bioExpanded ? "Show less" : "Read more"}
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-gray-600 text-sm italic">No biography available.</p>
              )}
            </div>
          </div>

          {/* Filmography — career timeline, newest year first */}
          {visibleMovies.length > 0 && (
            <div>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-7">
                <h2 className="text-xl sm:text-2xl font-bold">Career Timeline</h2>
                <span className="text-gray-500 text-sm">
                  {visibleMovies.length}{" "}
                  {visibleMovies.length === 1 ? "movie" : "movies"}
                  {careerSpan ? ` · ${careerSpan}` : ""}
                </span>

              </div>

              {/* Credit-kind chips — a single kind means there is nothing to filter */}
              {availableKinds.length > 1 && (
                <div className="flex items-center gap-2 mb-7 overflow-x-auto pb-1">
                  {[...availableKinds, { key: "all", label: "All" }].map((k) => {
                    const count =
                      k.key === "all" ? movies.length : kindCounts[k.key];
                    const active = activeKind === k.key;
                    return (
                      <button
                        key={k.key}
                        onClick={() => setCreditFilter(k.key)}
                        className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 cursor-pointer ${
                          active
                            ? "bg-red-600 border-red-600 text-white"
                            : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/25"
                        }`}
                      >
                        {k.label}
                        <span
                          className={
                            active ? "text-white/70" : "text-gray-600"
                          }
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {timeline.map(([year, films], groupIndex) => (
                <section key={year} className="flex gap-4 sm:gap-6">
                  {/* Rail — dot marks the year, line joins it to the next */}
                  <div className="flex flex-col items-center flex-shrink-0 w-3 sm:w-4">
                    <span
                      className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-red-500 flex-shrink-0 mt-2"
                      style={{ boxShadow: "0 0 0 4px rgba(239,68,68,0.15)" }}
                    />
                    {groupIndex < timeline.length - 1 && (
                      <span className="flex-1 w-px bg-gradient-to-b from-red-500/50 via-white/12 to-white/5" />
                    )}
                  </div>

                  {/* Year block */}
                  <div className="flex-1 min-w-0 pb-10 sm:pb-12">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-none">
                        {year}
                      </h3>
                      <span className="text-[11px] uppercase tracking-widest text-gray-500 whitespace-nowrap">
                        {films.length} {films.length === 1 ? "film" : "films"}
                      </span>
                      <span className="flex-1 h-px bg-white/10" />
                    </div>

                    {/* A lone credit spans the full width rather than sitting in a
                        one-third column with dead space beside it */}
                    <div
                      className={`grid gap-3 ${
                        films.length === 1
                          ? "grid-cols-1"
                          : "grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3"
                      }`}
                    >
                      {films.map((movie) => (
                        <TimelineFilm
                          key={`${movie.kind}-${movie.id}`}
                          movie={movie}
                        />
                      ))}
                    </div>
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PersonPage;
