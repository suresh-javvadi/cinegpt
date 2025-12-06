import React from "react";
import { useSelector } from "react-redux";
import useMovieTrailer from "../../hooks/useMovieTrailer";

const VideoBackground = ({ movieId }) => {
  const movieTrailer = useSelector((store) => store.movies?.movieTrailer);
  useMovieTrailer(movieId);

  return (
    <div className="relative w-full overflow-hidden">
      <iframe
        className="w-full aspect-video"
        src={`https://www.youtube.com/embed/${movieTrailer?.key}?autoplay=1&mute=1&loop=1&playlist=${movieTrailer?.key}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      ></iframe>
    </div>
  );
};

export default VideoBackground;
