import React, { useEffect } from "react";
import Header from "../../components/Header";
import useNowPlayingMovies from "../../hooks/useNowPlayingMovies";
import TopContainer from "./topContainer";
import SecondaryContainer from "./SecondaryContainer";
import usePopularMovies from "../../hooks/usePopularMovies";
import GptSearch from "../gptSearch/GptSearch";
import { useSelector } from "react-redux";
import ScreenLoader from "../../components/ScreenLoader";

const Browse = () => {
  const showGptSearch = useSelector((store) => store?.gptSearch?.showGptSearch);
  useNowPlayingMovies();
  usePopularMovies();

  const nowPlayingMovies = useSelector(
    (store) => store.movies?.nowPlayingMovies
  );

  const popularMovies = useSelector((store) => store.movies?.popularMovies);

  const isLoading = !nowPlayingMovies || !popularMovies;

  return (
    <div className="relative min-h-screen w-full text-white overflow-x-hidden">
      <Header />
      <div>
        {isLoading ? (
          <ScreenLoader />
        ) : showGptSearch ? (
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
