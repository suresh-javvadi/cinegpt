import React from "react";
import GptSearchBar from "./GptSearchBar";
import { LOGIN_BG_IMG } from "../../utils/constants";
import GptSuggestions from "./GptSuggestions";

const GptSearch = () => {
  return (
    <div>
      <div className="fixed -z-10 ">
        <img src={LOGIN_BG_IMG} alt="background Image" />
      </div>
      <GptSearchBar />
      <GptSuggestions />
    </div>
  );
};

export default GptSearch;
