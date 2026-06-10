import React from "react";
import GptSearchBar from "./GptSearchBar";
import loginBg from "../../assets/login-bg.webp";
import GptSuggestions from "./GptSuggestions";

const GptSearch = () => {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <div className="fixed inset-0 -z-10 h-screen">
        <img
          src={loginBg}
          alt="background"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="pt-14 sm:pt-16 px-3 sm:px-6 md:px-10 w-full mb-6">
        <GptSearchBar />
        <GptSuggestions />
      </div>
    </div>
  );
};

export default GptSearch;
