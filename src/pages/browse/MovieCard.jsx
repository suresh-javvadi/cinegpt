import React from "react";
import { useNavigate } from "react-router";
import { MOVIE_IMAGE_URL } from "../../utils/constants";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  if (!movie.poster_path) return null;

  return (
    <div
      onClick={() => navigate(`/movie/${movie.id}`)}
      className="
        min-w-[100px]
        sm:min-w-[150px]
        md:min-w-[170px]
        lg:min-w-[200px]

        h-[150px] sm:h-[225px] md:h-[255px] lg:h-[300px]
        rounded-lg
        overflow-hidden
        cursor-pointer
        transform
        transition
        duration-300
        hover:scale-105
        active:scale-95
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
