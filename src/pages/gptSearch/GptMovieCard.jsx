import React from "react";
import { useNavigate } from "react-router";
import { MOVIE_IMAGE_URL } from "../../utils/constants";

const GptMovieCard = ({ movie }) => {
  const navigate = useNavigate();
  if (!movie?.poster_path) return null;

  const year = movie.release_date?.slice(0, 4);
  const rating = movie.vote_average ? (Math.round(movie.vote_average * 10) / 10).toFixed(1) : null;

  return (
    <div
      onClick={() => navigate(`/movie/${movie.id}`)}
      className="w-full flex-shrink-0 cursor-pointer group"
    >
      <div className="rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
        <img
          src={MOVIE_IMAGE_URL + movie.poster_path}
          alt={movie.title}
          className="w-full aspect-[2/3] object-cover"
        />
      </div>

      <div className="mt-2 px-0.5 space-y-0.5">
        <p className="text-white text-xs sm:text-sm font-medium leading-tight line-clamp-2">
          {movie.title}
        </p>
        <div className="flex items-center gap-2">
          {year && (
            <span className="text-gray-500 text-xs">{year}</span>
          )}
          {rating && (
            <span className="flex items-center gap-0.5 text-yellow-400 text-xs font-medium">
              ★ {rating}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default GptMovieCard;
