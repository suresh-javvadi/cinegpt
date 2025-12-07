import React from "react";
import { useSelector } from "react-redux";
import MoviesList from "../browse/MoviesList";

const GptSuggestions = () => {
  const { gptMovieNames, gptMovieResults } = useSelector(
    (store) => store.gptSearch
  );

  if (!gptMovieNames?.length) return null;

  return (
    <div
      className="
        mt-8 
        px-4 sm:px-6 md:px-10 
        mx-auto 
        space-y-8
        text-white
        bg-black/90
        rounded-xl
        p-4
      "
    >
      {gptMovieNames?.map((movieName, index) => (
        <MoviesList
          key={movieName}
          title={movieName}
          movies={gptMovieResults[index]}
        />
      ))}
    </div>
  );
};

export default GptSuggestions;
