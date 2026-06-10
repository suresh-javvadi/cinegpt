import React from "react";
import { useSelector } from "react-redux";
import useMovieTrailer from "../../hooks/useMovieTrailer";
import TrailerUnavailable from "./TrailerUnavailable";

const VideoBackground = ({ movieId }) => {
  const movieTrailer = useSelector(
    (store) => store.movies?.movieTrailers[movieId],
  );

  useMovieTrailer(movieId);

  // undefined = still fetching — plain black, VideoTitle overlay visible on top
  if (movieTrailer === undefined) {
    return (
      <div className="relative w-full overflow-hidden">
        <div className="w-full aspect-video bg-black" />
      </div>
    );
  }

  // Fetch done, no trailer found — show unavailable UI
  if (movieTrailer === null) return <TrailerUnavailable />;

  return (
    <div className="relative w-full overflow-hidden bg-black">
      <iframe
        key={movieTrailer.key}
        className="w-full aspect-video transition-opacity duration-700"
        src={`https://www.youtube.com/embed/${movieTrailer?.key}?autoplay=1&mute=1&loop=1&playlist=${movieTrailer?.key}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      />
    </div>
  );
};

export default VideoBackground;
