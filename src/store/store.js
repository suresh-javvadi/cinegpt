import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../slices/userSlice";
import moviesReducer from "../slices/movieSlice";
import gptSlice from "../slices/gptSlice";
import configSlice from "../slices/configSlice";

const appStore = configureStore({
  reducer: {
    user: userSlice,
    movies: moviesReducer,
    gptSearch: gptSlice,
    config: configSlice,
  },
});

export default appStore;
