import React from "react";
import Header from "../../components/Header";
import TopContainer from "./TopContainer";
import SecondaryContainer from "./SecondaryContainer";
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
  const nowPlaying = useSelector((store) => store.movies?.nowPlayingMovies);
  const popular = useSelector((store) => store.movies?.popularMovies);
  const topRated = useSelector((store) => store.movies?.topRated);
  const upcoming = useSelector((store) => store.movies?.upcoming);

  const { error: nowPlayingError } = useFetchMovies(
    "https://api.themoviedb.org/3/movie/now_playing",
    addNowPlayingMovies,
    (store) => store.movies?.nowPlayingMovies,
  );
  const { error: popularError } = useFetchMovies(
    "https://api.themoviedb.org/3/movie/popular",
    addPopularMovies,
    (store) => store.movies?.popularMovies,
  );
  const { error: topRatedError } = useFetchMovies(
    "https://api.themoviedb.org/3/movie/top_rated",
    addTopRatedMovies,
    (store) => store.movies?.topRated,
  );
  const { error: upcomingError } = useFetchMovies(
    "https://api.themoviedb.org/3/movie/upcoming",
    addUpcomingMovies,
    (store) => store.movies?.upcoming,
  );

  const isLoading = !nowPlaying && !nowPlayingError;

  return (
    <div className="relative min-h-screen w-full text-white overflow-x-hidden pb-10">
      <Header />
      <div>
        {isLoading ? (
          <ScreenLoader />
        ) : (
          <>
            <TopContainer />
            <SecondaryContainer
              errors={{
                nowPlayingError,
                popularError,
                topRatedError,
                upcomingError,
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Browse;
