import React from "react";
import { useNavigate } from "react-router";
import { MOVIE_IMAGE_URL } from "../../utils/constants";

const GptMovieCard = ({ movie, featured = false }) => {
  const navigate = useNavigate();
  if (!movie?.poster_path) return null;

  const year = movie.release_date?.slice(0, 4);
  const rating = movie.vote_average
    ? (Math.round(movie.vote_average * 10) / 10).toFixed(1)
    : null;

  return (
    <div
      onClick={() => navigate(`/movie/${movie.id}`)}
      className={`cursor-pointer group ${featured ? "" : "w-full flex-shrink-0"}`}
    >
      <div className="relative rounded-xl overflow-hidden">
        <img
          src={MOVIE_IMAGE_URL + movie.poster_path}
          alt={movie.title}
          className="w-full aspect-[2/3] object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
          <p className="text-white text-xs sm:text-sm font-semibold leading-tight line-clamp-2">
            {movie.title}
          </p>
          {(year || rating) && (
            <div className="flex items-center gap-2 mt-1">
              {year && <span className="text-gray-300 text-xs">{year}</span>}
              {rating && (
                <span className="flex items-center gap-0.5 text-yellow-400 text-xs font-medium">
                  ★ {rating}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Rating badge — always visible */}
        {rating && (
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-md px-1.5 py-0.5 flex items-center gap-0.5">
            <span className="text-yellow-400 text-[10px]">★</span>
            <span className="text-white text-[10px] font-semibold">{rating}</span>
          </div>
        )}
      </div>

      {/* Below-card info */}
      <div className="mt-2 px-0.5 space-y-0.5">
        <p className="text-white text-xs sm:text-sm font-medium leading-tight line-clamp-2">
          {movie.title}
        </p>
        {year && <p className="text-gray-500 text-xs">{year}</p>}
      </div>
    </div>
  );
};

export default GptMovieCard;
