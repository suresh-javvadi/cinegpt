import { createSlice } from "@reduxjs/toolkit";

const gptSlice = createSlice({
  name: "gpt",
  initialState: {
    showGptSearch: false,
    gptMovieResults: null,
    gptMovieNames: null,
    gptQuery: null,
  },

  reducers: {
    toggleGptSearchView: (state) => {
      state.showGptSearch = !state.showGptSearch;
    },
    addGptMovieResult: (state, action) => {
      const { movieNames, movieResults, query } = action.payload;
      state.gptMovieNames = movieNames;
      state.gptMovieResults = movieResults;
      state.gptQuery = query;
    },
    clearGptResults: (state) => {
      state.gptMovieNames = null;
      state.gptMovieResults = null;
      state.gptQuery = null;
    },
  },
});

export const { toggleGptSearchView, addGptMovieResult, clearGptResults } = gptSlice.actions;

export default gptSlice.reducer;
