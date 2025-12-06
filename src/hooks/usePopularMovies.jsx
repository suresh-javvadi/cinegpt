import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_GET_OPTIONS } from "../utils/constants";
import { addNowPlayingMovies, addPopularMovies } from "../slices/movieSlice";

const usePopularMovies = () => {
  const dispatch = useDispatch();
  const popularMovies = useSelector((store) => store.movies?.popularMovies);

  const fetchNowPlayingMoviesData = async () => {
    const data = await fetch(
      "https://api.themoviedb.org/3/movie/popular?page=1",
      API_GET_OPTIONS
    );
    const json = await data.json();

    dispatch(addPopularMovies(json.results));
  };

  useEffect(() => {
    !popularMovies && fetchNowPlayingMoviesData();
  }, []);
};

export default usePopularMovies;
