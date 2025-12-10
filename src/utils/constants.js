export const API_GET_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
  },
};

export const MOVIE_IMAGE_URL = "https://image.tmdb.org/t/p/w500/";

export const LANGUAGE_OPTIONS = [
  {
    value: "en",
    name: "English",
  },
  {
    value: "hindi",
    name: "Hindi",
  },
  {
    value: "telugu",
    name: "Telugu",
  },
];
