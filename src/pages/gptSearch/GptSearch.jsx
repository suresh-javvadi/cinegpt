import React from "react";
import GptSearchBar from "./GptSearchBar";
import loginBg from "../../assets/login-bg.webp";
import GptSuggestions from "./GptSuggestions";
import Header from "../../components/Header";

const GptSearch = () => {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden pb-20 sm:pb-0">
      <Header />

      {/* Background — CSS bg is more reliable than <img> tag */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: `url(${loginBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      />
      <div className="fixed inset-0 -z-10 bg-black/80" />
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-purple-950/30 via-black/60 to-black" />

      {/* Decorative glows */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] -z-10 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(139,92,246,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="pt-16 sm:pt-20 px-4 sm:px-6 md:px-10 w-full pb-16">

        {/* Hero */}
        <div className="text-center mt-8 sm:mt-14 mb-10 sm:mb-12">

          {/* Icon */}
          <div className="flex justify-center mb-5">
            <div className="relative">
              {/* Glow ring */}
              <div
                className="absolute inset-0 rounded-2xl blur-xl"
                style={{ background: "rgba(139,92,246,0.4)", transform: "scale(1.4)" }}
              />
              <div
                className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                  boxShadow: "0 8px 32px rgba(124,58,237,0.5)",
                }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex-1 max-w-[50px] h-px bg-gradient-to-r from-transparent to-purple-500/40" />
            <span className="text-purple-400/80 text-[10px] font-semibold tracking-[0.3em] uppercase">
              AI-Powered Search
            </span>
            <div className="flex-1 max-w-[50px] h-px bg-gradient-to-l from-transparent to-purple-500/40" />
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-4 leading-tight tracking-tight">
            What should you{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #a78bfa, #818cf8, #c084fc)" }}
            >
              watch next?
            </span>
          </h1>

          <p className="text-gray-400 text-sm sm:text-base max-w-sm sm:max-w-md mx-auto leading-relaxed">
            Describe a mood, genre, actor, or any idea — Gemini AI finds the perfect movies for you.
          </p>
        </div>

        <GptSearchBar />
        <GptSuggestions />
      </div>
    </div>
  );
};

export default GptSearch;
