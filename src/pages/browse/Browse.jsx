import React from "react";
import Header from "../../components/Header";
import TopContainer from "./TopContainer";
import SecondaryContainer from "./SecondaryContainer";
import GptSearch from "../gptSearch/GptSearch";
import { useSelector } from "react-redux";
import ScreenLoader from "../../components/ScreenLoader";
import useFetchMovies from "../../hooks/useFetchMovies";
import {
  addNowPlayingMovies,
  addPopularMovies,
  addTopRatedMovies,
  addUpcomingMovies,
} from "../../slices/movieSlice";

const Browse = () => {
  const showGptSearch = useSelector((store) => store?.gptSearch?.showGptSearch);
  const nowPlaying = useSelector((store) => store.movies?.nowPlayingMovies);
  const popular = useSelector((store) => store.movies?.popularMovies);
  const topRated = useSelector((store) => store.movies?.topRated);
  const upcoming = useSelector((store) => store.movies?.upcoming);

  useFetchMovies(
    "https://api.themoviedb.org/3/movie/now_playing",
    addNowPlayingMovies,
    (store) => store.movies?.nowPlayingMovies
  );

  useFetchMovies(
    "https://api.themoviedb.org/3/movie/popular",
    addPopularMovies,
    (store) => store.movies?.popularMovies
  );
  useFetchMovies(
    "https://api.themoviedb.org/3/movie/top_rated",
    addTopRatedMovies,
    (store) => store.movies?.topRated
  );
  useFetchMovies(
    "https://api.themoviedb.org/3/movie/upcoming",
    addUpcomingMovies,
    (store) => store.movies?.upcoming
  );

  const isLoading = !nowPlaying || !popular || !topRated || !upcoming;

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
