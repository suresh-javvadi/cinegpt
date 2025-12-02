import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addMovieTrailer } from "../slices/movieSlice";
import { API_GET_OPTIONS } from "../utils/constants";

const useMovieTrailer = (movieId) => {
  const dispatch = useDispatch();

  const fetchMovieDetails = async () => {
    const data = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/videos`,
      API_GET_OPTIONS
    );
    const json = await data.json();
    const trailerData = json.results.filter(
      (video) => video.type === "Trailer"
    );

    const trailer = trailerData?.length ? trailerData[0] : json.results[0];

    dispatch(addMovieTrailer(trailer));
  };

  useEffect(() => {
    fetchMovieDetails();
  }, []);
};

export default useMovieTrailer;
