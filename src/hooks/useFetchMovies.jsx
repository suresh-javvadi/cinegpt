import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_GET_OPTIONS } from "../utils/constants";

const useFetchMovies = (url, action, selector) => {
  const dispatch = useDispatch();
  const data = useSelector(selector);

  useEffect(() => {
    if (!data) {
      fetchMovies();
    }
  }, [data, dispatch, url]);

  const fetchMovies = async () => {
    fetch(url, API_GET_OPTIONS)
      .then((res) => res.json())
      .then((json) => dispatch(action(json.results)))
      .catch(console.error);
  };
};

export default useFetchMovies;
