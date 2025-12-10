import React from "react";

const ScreenLoader = () => {
  return (
    <div className="w-full h-screen bg-black flex flex-col gap-8 px-6 py-10 animate-pulse">
      {/* Hero Skeleton */}
      <div className="w-full h-64 bg-neutral-800 rounded-lg"></div>

      {/* Row Skeletons */}
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="h-5 w-40 bg-neutral-800 rounded"></div>
          <div className="flex gap-3">
            {[...Array(5)].map((_, j) => (
              <div
                key={j}
                className="w-40 h-24 bg-neutral-800 rounded-lg"
              ></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScreenLoader;
