import React from "react";
import { MOVIE_IMAGE_URL } from "../../utils/constants";

const MovieCard = ({ movie }) => {
  if (!movie.poster_path) return null;

  return (
    <div
      className="
        min-w-[120px]
        sm:min-w-[150px]
        md:min-w-[180px]
        lg:min-w-[200px]

        h-[180px] sm:h-[225px] md:h-[270px] lg:h-[300px]
        rounded-lg 
        overflow-hidden
        cursor-pointer
        transform 
        transition 
        duration-300 
        hover:scale-105
      "
    >
      <img
        src={MOVIE_IMAGE_URL + movie.poster_path}
        alt={movie?.title}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default MovieCard;
