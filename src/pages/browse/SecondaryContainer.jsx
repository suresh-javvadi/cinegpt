import React from "react";
import MoviesList from "./MoviesList";
import { useSelector } from "react-redux";

const SecondaryContainer = ({ errors = {} }) => {
  const allMovies = useSelector((store) => store.movies);

  const nowPlayingIds = new Set(allMovies.nowPlayingMovies?.map((m) => m.id) ?? []);
  const upcoming = allMovies.upcoming?.filter((m) => !nowPlayingIds.has(m.id)) ?? null;

  return (
    <div className="bg-black px-2 sm:px-4 md:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">
      <div className="-mt-6 sm:-mt-28 md:-mt-40 relative z-10">
        <MoviesList title="Now Playing" movies={allMovies.nowPlayingMovies} error={errors.nowPlayingError} />
      </div>
      <MoviesList title="Popular Movies" movies={allMovies.popularMovies} error={errors.popularError} />
      <MoviesList title="Top Rated Movies" movies={allMovies.topRated} error={errors.topRatedError} />
      <MoviesList title="Upcoming Movies" movies={upcoming} error={errors.upcomingError} />
    </div>
  );
};

export default SecondaryContainer;
