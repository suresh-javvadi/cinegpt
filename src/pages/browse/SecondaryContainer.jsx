import React from "react";
import MoviesList from "./MoviesList";
import { useSelector } from "react-redux";

const SecondaryContainer = () => {
  const allMovies = useSelector((store) => store.movies);

  return (
    <div className="bg-black p-6">
      <div className="-mt-58 relative z-10">
        <MoviesList title="Now Playing" movies={allMovies.nowPlayingMovies} />
      </div>
      <MoviesList title="Popular Movies" movies={allMovies.popularMovies} />
      <MoviesList title="Top Rated Movies" movies={allMovies.popularMovies} />
      <MoviesList title="Up coming Movies" movies={allMovies.popularMovies} />
    </div>
  );
};

export default SecondaryContainer;
