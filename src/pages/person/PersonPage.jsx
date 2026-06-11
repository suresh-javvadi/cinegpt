import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import Header from "../../components/Header";
import GptMovieCard from "../gptSearch/GptMovieCard";
import { API_GET_OPTIONS, MOVIE_IMAGE_URL } from "../../utils/constants";

const PersonPage = () => {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [credits, setCredits] = useState(null);
  const [bioExpanded, setBioExpanded] = useState(false);
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

  const movies = credits?.cast
    ?.filter((m) => m.poster_path && m.vote_count > 10)
    ?.sort((a, b) => b.popularity - a.popularity)
    ?? [];

  const bio = person?.biography;
  const bioShort = bio?.length > 400;
  const displayBio = bioShort && !bioExpanded ? bio?.slice(0, 400) + "…" : bio;

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      <Header />

      {loading && (
        <div className="flex justify-center items-center min-h-screen">
          <div className="h-10 w-10 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && person && (
        <div className="pt-20 sm:pt-24 px-4 sm:px-8 md:px-12 pb-16">

          {/* Profile section */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 mb-10">

            {/* Photo */}
            <div className="flex-shrink-0 self-start">
              {person.profile_path ? (
                <img
                  src={MOVIE_IMAGE_URL + person.profile_path}
                  alt={person.name}
                  className="w-36 sm:w-48 md:w-56 rounded-2xl object-cover shadow-2xl border border-white/10"
                />
              ) : (
                <div className="w-36 sm:w-48 md:w-56 aspect-[2/3] rounded-2xl bg-gray-800 flex items-center justify-center text-5xl">
                  👤
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">
                {person.known_for_department ?? "Actor"}
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 leading-tight">
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
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{displayBio}</p>
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

          {/* Filmography */}
          {movies.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">
                Known For
                <span className="text-gray-500 text-sm font-normal ml-2">{movies.length} movies</span>
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
                {movies.map((movie) => (
                  <GptMovieCard key={movie.credit_id} movie={movie} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PersonPage;
