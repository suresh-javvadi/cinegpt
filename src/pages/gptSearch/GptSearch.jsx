import React from "react";
import GptSearchBar from "./GptSearchBar";
import { LOGIN_BG_IMG } from "../../utils/constants";

const GptSearch = () => {
  return (
    <div>
      <div className="absolute -z-10">
        <img src={LOGIN_BG_IMG} alt="background Image" />
      </div>
      <GptSearchBar />
    </div>
  );
};

export default GptSearch;
