import { createSlice } from "@reduxjs/toolkit";

const configSlice = createSlice({
  name: "config",
  initialState: {
    lang: "en",
    browseLanguage: "all",
  },
  reducers: {
    changeLanguage: (state, action) => {
      state.lang = action.payload;
    },
    setBrowseLanguage: (state, action) => {
      state.browseLanguage = action.payload;
    },
  },
});

export const { changeLanguage, setBrowseLanguage } = configSlice.actions;

export default configSlice.reducer;
