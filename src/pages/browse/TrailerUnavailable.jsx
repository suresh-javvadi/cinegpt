import React from "react";

const TrailerUnavailable = () => (
  <div
    className="relative w-full overflow-hidden rounded-2xl flex items-center justify-center"
    style={{ aspectRatio: "16/9", background: "#060608" }}
  >
    {/* Scanline overlay */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,.014) 3px,rgba(255,255,255,.014) 4px)",
      }}
    />

    {/* Purple radial ambient */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          "radial-gradient(ellipse 70% 80% at 50% 50%,rgba(90,50,180,.2) 0%,rgba(20,10,60,.15) 40%,transparent 70%)",
      }}
    />

    {/* Top edge accent */}
    <div
      className="absolute top-0 left-0 right-0 h-px pointer-events-none"
      style={{
        background: "rgba(160,100,255,.25)",
      }}
    />

    {/* Levitating content */}
    <div
      className="relative flex flex-col items-center"
      style={{ animation: "levitate 5s ease-in-out infinite" }}
    >
      {/* Reel + orbit system */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Glow breathe */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle,rgba(120,70,255,.35) 0%,transparent 70%)",
            animation: "glowBreathe 3s ease-in-out infinite",
          }}
        />

        {/* Spinning SVG rings */}
        <svg
          width="128"
          height="128"
          viewBox="0 0 128 128"
          className="absolute top-0 left-0"
        >
          <circle
            cx="64"
            cy="64"
            r="58"
            fill="none"
            stroke="rgba(255,255,255,.06)"
            strokeWidth="1"
          />
          <circle
            cx="64"
            cy="64"
            r="58"
            fill="none"
            stroke="rgba(140,90,255,.35)"
            strokeWidth="1.5"
            strokeDasharray="18 8"
            style={{
              animation: "ringSpin 8s linear infinite",
              transformOrigin: "64px 64px",
            }}
          />
          <circle
            cx="64"
            cy="64"
            r="43"
            fill="none"
            stroke="rgba(120,70,255,.25)"
            strokeWidth="1"
            strokeDasharray="10 14"
            style={{
              animation: "ringSpin2 6s linear infinite",
              transformOrigin: "64px 64px",
            }}
          />
        </svg>

        {/* Orbiting dots */}
        {["orbit1", "orbit2", "orbit3"].map((cls, i) => (
          <div
            key={i}
            className="absolute w-32 h-32 top-0 left-0 flex items-center justify-center"
          >
            <div
              style={{
                width: i === 0 ? 8 : i === 1 ? 6 : 5,
                height: i === 0 ? 8 : i === 1 ? 6 : 5,
                borderRadius: "50%",
                background:
                  i === 0
                    ? "rgba(180,130,255,.9)"
                    : i === 1
                      ? "rgba(220,180,255,.7)"
                      : "rgba(200,160,255,.6)",
                position: "absolute",
                animation: `${cls} 4s linear infinite`,
              }}
            />
          </div>
        ))}

        {/* Particle sparks from center */}
        <div
          className="absolute"
          style={{
            top: "50%",
            left: "50%",
            width: 4,
            height: 4,
            marginTop: -2,
            marginLeft: -2,
          }}
        >
          {["sparkA", "sparkB", "sparkC", "sparkD", "sparkE", "sparkF"].map(
            (anim, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: i % 2 === 0 ? 3 : 2.5,
                  height: i % 2 === 0 ? 3 : 2.5,
                  borderRadius: "50%",
                  background:
                    i % 3 === 0
                      ? "rgba(220,190,255,.9)"
                      : i % 3 === 1
                        ? "rgba(255,255,255,.8)"
                        : "rgba(200,160,255,.9)",
                  marginTop: -1.5,
                  marginLeft: -1.5,
                  animation: `${anim} 2.4s ease-out infinite ${(i * 0.4).toFixed(1)}s`,
                }}
              />
            ),
          )}
        </div>

        {/* Center icon circle */}
        <div
          className="relative rounded-full flex items-center justify-center overflow-hidden"
          style={{
            width: 52,
            height: 52,
            background: "rgba(100,60,200,.25)",
            border: "1px solid rgba(160,110,255,.3)",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <rect
              x="1.5"
              y="5"
              width="19"
              height="12"
              rx="2"
              stroke="rgba(200,160,255,0.9)"
              strokeWidth="1.2"
            />
            <rect
              x="4"
              y="2.5"
              width="3"
              height="3.5"
              rx="0.8"
              fill="rgba(200,160,255,0.5)"
            />
            <rect
              x="9.5"
              y="2.5"
              width="3"
              height="3.5"
              rx="0.8"
              fill="rgba(200,160,255,0.5)"
            />
            <rect
              x="15"
              y="2.5"
              width="3"
              height="3.5"
              rx="0.8"
              fill="rgba(200,160,255,0.5)"
            />
            <rect
              x="4"
              y="16"
              width="3"
              height="3.5"
              rx="0.8"
              fill="rgba(200,160,255,0.5)"
            />
            <rect
              x="9.5"
              y="16"
              width="3"
              height="3.5"
              rx="0.8"
              fill="rgba(200,160,255,0.5)"
            />
            <rect
              x="15"
              y="16"
              width="3"
              height="3.5"
              rx="0.8"
              fill="rgba(200,160,255,0.5)"
            />
            <line
              x1="8"
              y1="9"
              x2="8"
              y2="13"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <line
              x1="14"
              y1="9"
              x2="14"
              y2="13"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Text block */}
      <div className="flex flex-col items-center gap-2.5 mt-7">
        {/* NO SIGNAL badge */}
        <div
          className="flex items-center gap-2.5"
          style={{
            animation: "badgePop .5s cubic-bezier(.34,1.56,.64,1) forwards .2s",
            opacity: 0,
          }}
        >
          <div
            style={{
              height: 1,
              width: 36,
              background: "rgba(160,100,255,.4)",
              transformOrigin: "right",
              animation: "lineExpand .6s ease forwards .5s",
              transform: "scaleX(0)",
            }}
          />
          <span
            style={{
              fontSize: 10,
              letterSpacing: ".22em",
              color: "rgba(160,100,255,.8)",
              fontWeight: 500,
            }}
          >
            NO SIGNAL
          </span>
          <div
            style={{
              height: 1,
              width: 36,
              background: "rgba(160,100,255,.4)",
              transformOrigin: "left",
              animation: "lineExpand .6s ease forwards .5s",
              transform: "scaleX(0)",
            }}
          />
        </div>

        <p
          style={{
            fontSize: 22,
            fontWeight: 500,
            color: "rgba(255,255,255,.92)",
            margin: 0,
            letterSpacing: ".04em",
            animation: "titleIn .8s cubic-bezier(.22,1,.36,1) forwards .45s",
            opacity: 0,
          }}
        >
          Trailer unavailable
        </p>

        <p
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,.28)",
            margin: 0,
            animation: "subIn .7s ease forwards .8s",
            opacity: 0,
          }}
        >
          No preview found for this title right now
        </p>

        {/* Ticker dots */}
        <div
          className="flex items-center gap-1.5"
          style={{ animation: "subIn .5s ease forwards 1.1s", opacity: 0 }}
        >
          {[0, 0.25, 0.5].map((d, i) => (
            <span
              key={i}
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "rgba(160,100,255,.6)",
                display: "inline-block",
                animation: `ticker 1.4s ease-in-out infinite ${d}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>

    <style>{`
        @keyframes ringSpin    { to { transform: rotate(360deg); } }
        @keyframes ringSpin2   { to { transform: rotate(-360deg); } }
        @keyframes levitate    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes glowBreathe { 0%,100%{opacity:.12} 50%{opacity:.28} }
        @keyframes titleIn     { 0%{opacity:0;transform:translateY(16px) scale(.96)} 100%{opacity:1;transform:none} }
        @keyframes subIn       { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
        @keyframes lineExpand  { from{transform:scaleX(0)} to{transform:scaleX(1)} }
        @keyframes badgePop    { from{opacity:0;transform:scale(.7)} to{opacity:1;transform:scale(1)} }
        @keyframes ticker      { 0%,100%{opacity:.4} 50%{opacity:1} }
        @keyframes orbit1      { 0%{transform:rotate(0deg) translateX(52px) rotate(0deg)} 100%{transform:rotate(360deg) translateX(52px) rotate(-360deg)} }
        @keyframes orbit2      { 0%{transform:rotate(120deg) translateX(52px) rotate(-120deg)} 100%{transform:rotate(480deg) translateX(52px) rotate(-480deg)} }
        @keyframes orbit3      { 0%{transform:rotate(240deg) translateX(52px) rotate(-240deg)} 100%{transform:rotate(600deg) translateX(52px) rotate(-600deg)} }
        @keyframes sparkA      { 0%{opacity:0;transform:translate(-50%,-50%) scale(1)} 30%{opacity:1} 100%{opacity:0;transform:translate(calc(-50% - 28px),calc(-50% - 52px)) scale(0)} }
        @keyframes sparkB      { 0%{opacity:0;transform:translate(-50%,-50%) scale(1)} 30%{opacity:1} 100%{opacity:0;transform:translate(calc(-50% + 32px),calc(-50% - 58px)) scale(0)} }
        @keyframes sparkC      { 0%{opacity:0;transform:translate(-50%,-50%) scale(1)} 30%{opacity:1} 100%{opacity:0;transform:translate(calc(-50% + 14px),calc(-50% - 64px)) scale(0)} }
        @keyframes sparkD      { 0%{opacity:0;transform:translate(-50%,-50%) scale(1)} 30%{opacity:1} 100%{opacity:0;transform:translate(calc(-50% - 40px),calc(-50% - 36px)) scale(0)} }
        @keyframes sparkE      { 0%{opacity:0;transform:translate(-50%,-50%) scale(1)} 30%{opacity:1} 100%{opacity:0;transform:translate(calc(-50% + 44px),calc(-50% - 28px)) scale(0)} }
        @keyframes sparkF      { 0%{opacity:0;transform:translate(-50%,-50%) scale(1)} 30%{opacity:1} 100%{opacity:0;transform:translate(calc(-50% - 12px),calc(-50% - 70px)) scale(0)} }
      `}</style>
  </div>
);

export default TrailerUnavailable;
