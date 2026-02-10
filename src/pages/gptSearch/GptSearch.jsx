import React from "react";
import GptSearchBar from "./GptSearchBar";
import LOGIN_BG_IMG from "../../assets/Login_Bg.jpg";
import GptSuggestions from "./GptSuggestions";

const GptSearch = () => {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <div className="fixed inset-0 -z-10 h-screen">
        <img
          src={LOGIN_BG_IMG}
          alt="background"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="pt-12 sm:pt-18 px-4 sm:px-6 md:px-10 w-full mb-6">
        <GptSearchBar />
        <GptSuggestions />
      </div>
    </div>
  );
};

export default GptSearch;
