import React, { useEffect } from "react";
import Header from "../../components/Header";
import useNowPlayingMovies from "../../hooks/useNowPlayingMovies";
import TopContainer from "./topContainer";
import SecondaryContainer from "./SecondaryContainer";
import usePopularMovies from "../../hooks/usePopularMovies";
import GptSearch from "../gptSearch/GptSearch";
import { useSelector } from "react-redux";

const Browse = () => {
  const showGptSearch = useSelector((store) => store?.gptSearch?.showGptSearch);
  useNowPlayingMovies();
  usePopularMovies();

  return (
    <div className="relative min-h-screen w-full text-white overflow-x-hidden">
      <Header />
      <div>
        {showGptSearch ? (
          <GptSearch />
        ) : (
          <>
            <TopContainer />
            <SecondaryContainer />
          </>
        )}
      </div>
    </div>
  );
};

export default Browse;
