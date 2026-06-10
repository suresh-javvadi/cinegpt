import React from "react";
import { useSelector } from "react-redux";
import useMovieTrailer from "../../hooks/useMovieTrailer";
import TrailerUnavailable from "./TrailerUnavailable";

const VideoBackground = ({ movieId }) => {
  const movieTrailer = useSelector(
    (store) => store.movies?.movieTrailers[movieId],
  );

  useMovieTrailer(movieId);

  // undefined = still fetching — plain black
  if (movieTrailer === undefined) {
    return (
      <div className="relative w-full overflow-hidden bg-black">
        <div className="w-full aspect-[4/3] sm:aspect-video" />
      </div>
    );
  }

  // Fetch done, no trailer found — show unavailable UI
  if (movieTrailer === null) return <TrailerUnavailable />;

  return (
    <div className="relative w-full overflow-hidden bg-black">
      <iframe
        key={movieTrailer.key}
        className="w-full aspect-[4/3] sm:aspect-video transition-opacity duration-700 pointer-events-none"
        src={`https://www.youtube.com/embed/${movieTrailer.key}?autoplay=1&mute=1&loop=1&playlist=${movieTrailer.key}&controls=0&disablekb=1&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  );
};

export default VideoBackground;
