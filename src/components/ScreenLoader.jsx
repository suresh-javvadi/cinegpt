import React from "react";

const ScreenLoader = () => (
  <div className="w-full min-h-screen bg-black overflow-hidden">
    <style>{`
      @keyframes shimmer {
        0%   { background-position: -1200px 0 }
        100% { background-position:  1200px 0 }
      }
      .sk {
        background: linear-gradient(
          90deg,
          rgba(255,255,255,0.04) 25%,
          rgba(255,255,255,0.09) 50%,
          rgba(255,255,255,0.04) 75%
        );
        background-size: 1200px 100%;
        animation: shimmer 2s linear infinite;
        border-radius: 4px;
      }
    `}</style>

    {/* ── Fake Header ── */}
    <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 sm:px-10 md:px-16 py-5">
      <div className="h-7 w-28 sk" />
      <div className="flex items-center gap-4">
        <div className="h-5 w-16 sk hidden sm:block" />
        <div className="h-5 w-16 sk hidden sm:block" />
        <div className="h-8 w-8 sk rounded-full" />
      </div>
    </div>

    {/* ── Hero ── */}
    <div className="w-full aspect-[4/3] sm:aspect-video bg-zinc-900 relative overflow-hidden">
      {/* shimmer sweep */}
      <div className="absolute inset-0 sk" style={{ borderRadius: 0 }} />

      {/* left gradient like real UI */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* content skeletons — positioned like VideoTitle */}
      <div className="absolute inset-0 flex flex-col justify-end sm:justify-center px-4 sm:px-10 md:px-16 pb-10 sm:pb-0 gap-3">
        {/* Now Playing badge */}
        <div className="h-4 w-24 sk rounded-full" />
        {/* Title */}
        <div className="h-8 sm:h-11 md:h-14 w-52 sm:w-80 md:w-96 sk" />
        <div className="h-8 sm:h-11 md:h-14 w-40 sm:w-64 md:w-72 sk" />
        {/* Overview — only sm+ like real UI */}
        <div className="hidden sm:flex flex-col gap-2 mt-1">
          <div className="h-3 w-72 md:w-96 sk" />
          <div className="h-3 w-60 md:w-80 sk" />
          <div className="h-3 w-48 md:w-64 sk" />
        </div>
        {/* Buttons */}
        <div className="flex gap-2 sm:gap-3 mt-1">
          <div className="h-8 sm:h-10 w-20 sm:w-24 sk rounded-lg" />
          <div className="h-8 sm:h-10 w-24 sm:w-28 sk rounded-lg" />
        </div>
      </div>

      {/* Dot indicators at bottom */}
      <div className="absolute bottom-6 sm:bottom-32 md:bottom-44 left-1/2 -translate-x-1/2 flex gap-1.5">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`sk rounded-full ${i === 0 ? "w-12 sm:w-14 h-1 sm:h-1.5" : "w-1 sm:w-1.5 h-1 sm:h-1.5"}`}
          />
        ))}
      </div>
    </div>

    {/* ── Movie rows ── */}
    <div className="mt-2 space-y-8 px-4 sm:px-10 md:px-16 pb-10">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-3">
          {/* Row title */}
          <div className="h-5 w-32 sm:w-44 sk" />
          {/* Cards */}
          <div className="flex gap-2 sm:gap-3 overflow-hidden">
            {[...Array(8)].map((_, j) => (
              <div
                key={j}
                className="flex-shrink-0 w-[29vw] sm:w-[150px] md:w-[170px] lg:w-[200px] aspect-[2/3] sk rounded-lg"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ScreenLoader;
