import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import lang from "../../utils/languagesConstants";
import { API_GET_OPTIONS } from "../../utils/constants";
import { addGptMovieResult } from "../../slices/gptSlice";

const GptSearchBar = () => {
  const dispatch = useDispatch();
  const selectedLang = useSelector((store) => store.config.lang);
  const searchTerm = useRef(null);

  const fetchMovie = async (movie) => {
    const data = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${movie}&include_adult=false&language=en-US&page=1`,
      API_GET_OPTIONS
    );

    const json = await data.json();

    return json.results;
  };

  const handleGptSearch = async () => {
    const query = searchTerm.current.value.trim();
    if (!query) return;

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${import.meta.env.OPENAI_GPT_OSS_20B_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b:free",
        messages: [
          {
            role: "user",
            content:
              "Recommend exactly 5 movies in a single comma-separated line: " +
              query,
          },
        ],
      }),
    });

    const data = await res.json();
    console.log("GPT Response:", data.choices[0].message.content);

    const gptMovies = data.choices[0].message.content.split(",");

    const promiseArray = gptMovies.map((movie) => fetchMovie(movie));

    const movieResults = await Promise.all(promiseArray);

    dispatch(
      addGptMovieResult({ movieNames: gptMovies, movieResults: movieResults })
    );

    console.log(movieResults);
  };

  return (
    <div className="flex justify-center pt-[10%]">
      <form
        className="w-6/12 p-1 bg-black rounded-lg grid grid-cols-12"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          ref={searchTerm}
          type="text"
          placeholder={lang[selectedLang]?.gptSearchPlaceHolder}
          className="p-4 m-2 bg-white col-span-10 rounded-lg"
        />
        <button
          className="bg-red-700 m-2 text-white rounded-lg col-span-2"
          onClick={handleGptSearch}
        >
          {lang[selectedLang]?.search}
        </button>
      </form>
    </div>
  );
};

export default GptSearchBar;
