import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMovieTrailer } from "../slices/movieSlice";
import { API_GET_OPTIONS } from "../utils/constants";

const useMovieTrailer = (movieId) => {
  const dispatch = useDispatch();
  const trailer = useSelector(
    (store) => store.movies?.movieTrailers?.[movieId]
  );

  useEffect(() => {
    if (!movieId || trailer) return;

    fetchMovieDetails();
  }, [movieId, trailer, dispatch]);

  const fetchMovieDetails = async () => {
    try {
      const data = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/videos`,
        API_GET_OPTIONS
      );
      const json = await data.json();

      const trailers = json.results.filter(
        (v) => v.site === "YouTube" && v.type === "Trailer"
      );

      const selectedTrailer =
        trailers[0] || json.results.find((v) => v.site === "YouTube");

      if (selectedTrailer) {
        dispatch(
          addMovieTrailer({
            movieId,
            trailer: selectedTrailer,
          })
        );
      }
    } catch (err) {
      console.error("Failed to fetch trailer", err);
    }
  };
};

export default useMovieTrailer;
