import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../slices/userSlice";
import moviesReducer from "../slices/movieSlice";

const appStore = configureStore({
  reducer: {
    user: userSlice,
    movies: moviesReducer,
  },
});

export default appStore;
