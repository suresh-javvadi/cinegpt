import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { API_GET_OPTIONS } from "../utils/constants";
import { addNowPlayingMovies } from "../slices/movieSlice";

const useNowPlayingMovies = () => {
  const dispatch = useDispatch();

  const fetchNowPlayingMoviesData = async () => {
    const data = await fetch(
      "https://api.themoviedb.org/3/movie/now_playing?page=1",
      API_GET_OPTIONS
    );
    const json = await data.json();

    dispatch(addNowPlayingMovies(json.results));
  };

  useEffect(() => {
    fetchNowPlayingMoviesData();
  }, []);
};

export default useNowPlayingMovies;
