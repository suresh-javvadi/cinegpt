import React from "react";
import { MOVIE_IMAGE_URL } from "../../utils/constants";

const MovieCard = ({ movie }) => {
  if (!movie.poster_path) return;
  return (
    <div className="w-40 rounded-lg">
      <img
        src={MOVIE_IMAGE_URL + movie.poster_path}
        alt={movie?.title}
        className="rounded-lg"
      />
    </div>
  );
};

export default MovieCard;
