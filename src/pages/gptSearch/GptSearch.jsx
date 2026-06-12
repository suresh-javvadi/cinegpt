import React from "react";
import GptSearchBar from "./GptSearchBar";
import loginBg from "../../assets/login-bg.webp";
import GptSuggestions from "./GptSuggestions";
import Header from "../../components/Header";

const GptSearch = () => {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden pb-20 sm:pb-0">
      <Header />
      {/* Background with stronger dark overlay for distinct identity */}
      <div className="fixed inset-0 -z-10">
        <img src={loginBg} alt="background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/30 via-black/50 to-black/90" />
      </div>

      <div className="pt-16 sm:pt-20 px-3 sm:px-6 md:px-10 w-full pb-12">

        {/* Hero heading */}
        <div className="text-center mt-6 sm:mt-10 mb-8 sm:mb-10">
          {/* AI icon */}
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-900/50">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
              </svg>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
            What would you like to{" "}
            <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              watch?
            </span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Describe a mood, genre, or any idea — AI finds the perfect movies for you.
          </p>
        </div>

        <GptSearchBar />
        <GptSuggestions />
      </div>
    </div>
  );
};

export default GptSearch;
