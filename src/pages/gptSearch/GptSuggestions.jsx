import React from "react";
import { useSelector } from "react-redux";
import MoviesList from "../browse/MoviesList";

const GptSuggestions = () => {
  const { gptMovieNames, gptMovieResults } = useSelector(
    (store) => store.gptSearch
  );

  console.log(gptMovieNames, gptMovieResults);
  return (
    <div className="p-4 m-4 bg-black/80">
      <div>
        {gptMovieNames?.map((movieName, index) => (
          <MoviesList
            key={movieName}
            title={movieName}
            movies={gptMovieResults[index]}
          />
        ))}
      </div>
    </div>
  );
};

export default GptSuggestions;
