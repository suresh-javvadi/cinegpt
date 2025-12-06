import React from "react";

const VideoTitle = ({ movie }) => {
  const { title, overview } = movie;

  return (
    <div
      className="
        absolute inset-0
        flex flex-col 
        justify-end sm:justify-center
        text-white 
        bg-gradient-to-r from-black/80 via-black/40 to-transparent
        px-4 sm:px-10 md:px-16
        pb-10 sm:pb-0
        space-y-3
      "
    >
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold max-w-xl">
        {title}
      </h1>

      <p
        className="
          hidden 
          sm:block 
          text-base md:text-lg 
          max-w-sm md:max-w-xl 
          opacity-90 
          line-clamp-3
        "
      >
        {overview}
      </p>

      <div className="flex gap-2 pt-2">
        <button
          className="
            flex items-center gap-2 
            px-4 sm:px-6 md:px-8 
            py-1 sm:py-2               
            bg-white 
            text-black 
            rounded-lg 
            hover:opacity-80
          "
        >
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          <span className="xs:inline">Play</span>
        </button>

        {/* More Info */}
        <button
          className="
            px-4 sm:px-6 md:px-8 
            py-1 sm:py-2               
            bg-gray-300 
            text-black 
            rounded-lg 
            hover:opacity-80
          "
        >
          More Info
        </button>
      </div>
    </div>
  );
};

export default VideoTitle;
