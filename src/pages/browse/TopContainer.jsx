import React, { useState } from "react";
import VideoTitle from "./VideoTitle";
import VideoBackground from "./VideoBackground";
import { useSelector } from "react-redux";

const TopContainer = () => {
  const movies = useSelector((store) => store.movies?.nowPlayingMovies);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!movies || movies.length === 0) return null;

  const mainMovie = movies[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full overflow-hidden">
      <VideoBackground movieId={mainMovie?.id} />
      <div className="absolute inset-0 flex items-end sm:items-center justify-between px-4">
        <button
          onClick={handlePrev}
          className="z-10 bg-black/60 text-white p-3 rounded-full hover:bg-black"
        >
          ◀
        </button>

        <VideoTitle movie={mainMovie} />

        <button
          onClick={handleNext}
          className="z-10 bg-black/60 text-white p-3 rounded-full hover:bg-black"
        >
          ▶
        </button>
      </div>
    </div>
  );
};

export default TopContainer;
