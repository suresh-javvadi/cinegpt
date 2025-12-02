import React from "react";

const VideoTitle = ({ movie }) => {
  const { title, overview } = movie;

  return (
    <div className="p-10 absolute bg-gradient-to-r from-black aspect-video opacity-90 text-white pt-[20%]">
      <h1 className="text-4xl font-bold mb-2">{title}</h1>
      <p className="italic w-5/12 mb-2 text-sm">{overview}</p>
      <div className="flex gap-2 pt-2">
        <button className="px-8 py-2 bg-white text-black rounded-lg hover:opacity-80 cursor-pointer">
          ▶️ Play
        </button>
        <button className="px-8 py-2 bg-gray-400 text-black rounded-lg hover:opacity-80 cursor-pointer">
          More Info
        </button>
      </div>
    </div>
  );
};

export default VideoTitle;
