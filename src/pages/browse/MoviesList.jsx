import React from "react";
import MovieCard from "./MovieCard";

const MoviesList = ({ title, movies }) => {
  return (
    <div>
      <h1 className="text-xl sm:text-3xl font-semibold text-white mb-3 px-2 sm:px-0">
        {title}
      </h1>

      <div className="overflow-x-auto overflow-y-hidden scrollbar-hide">
        <div className="flex gap-4 px-2 sm:px-0 snap-x snap-mandatory">
          {movies?.map((movie) => (
            <div key={movie.id} className="snap-start">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoviesList;
