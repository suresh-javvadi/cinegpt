import React from "react";
import MoviesList from "./MoviesList";
import { useSelector } from "react-redux";

const SecondaryContainer = () => {
  const allMovies = useSelector((store) => store.movies);

  return (
    <div className="bg-black px-2 sm:px-6 py-6 space-y-6">
      <div className="-mt-12 sm:-mt-36 md:-mt-48 relative z-10">
        <MoviesList title="Now Playing" movies={allMovies.nowPlayingMovies} />
      </div>
      <MoviesList title="Popular Movies" movies={allMovies.popularMovies} />
      <MoviesList title="Top Rated Movies" movies={allMovies.topRated} />
      <MoviesList title="Upcoming Movies" movies={allMovies.upcoming} />
    </div>
  );
};

export default SecondaryContainer;
