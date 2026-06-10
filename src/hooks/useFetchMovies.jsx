import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_GET_OPTIONS } from "../utils/constants";

const useFetchMovies = (url, action, selector) => {
  const dispatch = useDispatch();
  const data = useSelector(selector);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!data) fetchMovies();
  }, [data, dispatch, url]);

  const fetchMovies = () => {
    setError(false);
    fetch(url, API_GET_OPTIONS)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => dispatch(action(json.results)))
      .catch((err) => {
        console.error(err);
        setError(true);
      });
  };

  return { error, retry: fetchMovies };
};

export default useFetchMovies;
