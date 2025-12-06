import React from "react";
import VideoTitle from "./VideoTitle";
import VideoBackground from "./VideoBackground";
import { useSelector } from "react-redux";

const TopContainer = () => {
  const movies = useSelector((store) => store.movies?.nowPlayingMovies);
  if (!movies) return null;

  const mainMovie = movies[0];

  return (
    <div className="relative w-full overflow-hidden">
      <VideoBackground movieId={mainMovie?.id} />
      <div className="absolute inset-0 flex items-end sm:items-center">
        <VideoTitle movie={mainMovie} />
      </div>
    </div>
  );
};

export default TopContainer;
