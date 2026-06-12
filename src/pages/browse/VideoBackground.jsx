import React from "react";
import { useSelector } from "react-redux";
import useMovieTrailer from "../../hooks/useMovieTrailer";
import TrailerUnavailable from "./TrailerUnavailable";

const VideoBackground = ({ movieId, backdropPath, setPaused }) => {
  const movieTrailer = useSelector(
    (store) => store.movies?.movieTrailers[movieId],
  );

  useMovieTrailer(movieId);

  const backdropImg = backdropPath
    ? `https://image.tmdb.org/t/p/original${backdropPath}`
    : null;

  return (
    <div
      className="relative w-full overflow-hidden bg-black"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Loading — show backdrop or shimmer */}
      {movieTrailer === undefined &&
        (backdropImg ? (
          <img
            src={backdropImg}
            alt=""
            className="w-full aspect-[4/3] sm:aspect-video object-cover opacity-70"
          />
        ) : (
          <div className="w-full aspect-[4/3] sm:aspect-video bg-neutral-900 animate-pulse" />
        ))}

      {/* No trailer — show backdrop or unavailable UI */}
      {movieTrailer === null &&
        (backdropImg ? (
          <img
            src={backdropImg}
            alt=""
            className="w-full aspect-[4/3] sm:aspect-video object-cover opacity-70"
          />
        ) : (
          <TrailerUnavailable />
        ))}

      {/* Trailer ready — autoplay muted iframe */}
      {movieTrailer?.key && (
        <iframe
          key={movieTrailer.key}
          className="w-full aspect-[4/3] sm:aspect-video pointer-events-none"
          src={`https://www.youtube.com/embed/${movieTrailer.key}?autoplay=1&mute=1&loop=1&playlist=${movieTrailer.key}&controls=0&disablekb=1&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      )}
    </div>
  );
};

export default VideoBackground;
