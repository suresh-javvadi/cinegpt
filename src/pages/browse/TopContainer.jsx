import React from "react";
import VideoTitle from "./VideoTitle";
import VideoBackground from "./VideoBackground";
import { useSelector } from "react-redux";

const TopContainer = () => {
  const movies = useSelector((store) => store.movies?.nowPlayingMovies);
  if (!movies) return;

  const mainMovie = movies[0];

  return (
    <div>
      <VideoTitle movie={mainMovie} />
      <VideoBackground movieId={mainMovie?.id} />
    </div>
  );
};

export default TopContainer;
