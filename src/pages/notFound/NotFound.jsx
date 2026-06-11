import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import Logo from "../../assets/logo.webp";

const NotFound = () => {
  const navigate = useNavigate();
  const ftRef = useRef(null);
  const fbRef = useRef(null);
  const particlesRef = useRef(null);

  useEffect(() => {
    // Film strip holes — fill full width dynamically
    const holeWidth = 36; // 26px box + 10px margins
    const count = Math.ceil(window.innerWidth / holeWidth) + 4;
    [ftRef, fbRef].forEach((ref) => {
      if (!ref.current) return;
      for (let i = 0; i < count; i++) {
        const h = document.createElement("div");
        h.className = "fh";
        ref.current.appendChild(h);
      }
    });

    // Floating particles
    if (!particlesRef.current) return;
    const configs = [
      { w: 3, top: "18%", left: "12%", delay: "0s", dur: "3s", anim: "float1" },
      { w: 4, top: "72%", left: "80%", delay: "1s", dur: "4s", anim: "float2" },
      {
        w: 2,
        top: "45%",
        left: "88%",
        delay: "0.5s",
        dur: "2.5s",
        anim: "float3",
      },
      {
        w: 3,
        top: "82%",
        left: "22%",
        delay: "1.5s",
        dur: "3.5s",
        anim: "float1",
      },
      {
        w: 5,
        top: "8%",
        left: "60%",
        delay: "2s",
        dur: "4.5s",
        anim: "float2",
      },
      {
        w: 2,
        top: "55%",
        left: "5%",
        delay: "0.3s",
        dur: "2.8s",
        anim: "float3",
      },
      {
        w: 4,
        top: "35%",
        left: "92%",
        delay: "1.8s",
        dur: "3.2s",
        anim: "float1",
      },
      {
        w: 3,
        top: "90%",
        left: "55%",
        delay: "0.8s",
        dur: "3.8s",
        anim: "float2",
      },
      {
        w: 2,
        top: "25%",
        left: "75%",
        delay: "2.5s",
        dur: "2.2s",
        anim: "float3",
      },
      {
        w: 4,
        top: "65%",
        left: "42%",
        delay: "1.2s",
        dur: "4.2s",
        anim: "float1",
      },
      {
        w: 3,
        top: "12%",
        left: "30%",
        delay: "0.6s",
        dur: "5s",
        anim: "float2",
      },
      {
        w: 2,
        top: "78%",
        left: "68%",
        delay: "3s",
        dur: "3.6s",
        anim: "float3",
      },
    ];
    configs.forEach(({ w, top, left, delay, dur, anim }) => {
      const p = document.createElement("div");
      p.style.cssText = `
        position: absolute;
        width: ${w}px; height: ${w}px;
        top: ${top}; left: ${left};
        border-radius: 50%;
        background: #a78bfa;
        opacity: 0.5;
        pointer-events: none;
        animation: ${anim} ${dur} ease-in-out infinite ${delay};
      `;
      particlesRef.current.appendChild(p);
    });
  }, []);

  return (
    <div className="relative h-screen overflow-hidden bg-[#080808] flex flex-col items-center justify-center font-['Space_Grotesk',sans-serif]">
      {/* Pulsing grid */}
      <div
        className="absolute inset-0 animate-[gridPulse_4s_ease-in-out_infinite]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 70% at 50% 50%,transparent 20%,#080808 85%)",
        }}
      />

      {/* Orbs — 7 total */}
      <div className="absolute w-80 h-80 -top-20 -left-16 rounded-full bg-violet-500/[0.12] animate-[drift1_7s_ease-in-out_infinite]" />
      <div className="absolute w-60 h-60 -bottom-16 -right-10 rounded-full bg-pink-500/[0.09] animate-[drift2_9s_ease-in-out_infinite]" />
      <div className="absolute w-[180px] h-[180px] top-[30%] right-[8%] rounded-full bg-indigo-500/[0.07] animate-[drift3_6s_ease-in-out_infinite_reverse]" />
      <div className="absolute w-[140px] h-[140px] bottom-[20%] left-[10%] rounded-full bg-violet-400/[0.06] animate-[drift4_11s_ease-in-out_infinite]" />
      <div className="absolute w-[100px] h-[100px] top-[15%] left-[35%] rounded-full bg-purple-300/[0.05] animate-[drift5_8s_ease-in-out_infinite_2s]" />
      <div className="absolute w-[80px] h-[80px] bottom-[25%] right-[25%] rounded-full bg-pink-400/[0.06] animate-[drift1_13s_ease-in-out_infinite_1s]" />
      <div className="absolute w-[60px] h-[60px] top-[60%] left-[20%] rounded-full bg-violet-500/[0.08] animate-[drift2_5s_ease-in-out_infinite_3s]" />

      {/* Floating particles container */}
      <div
        ref={particlesRef}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Scan line */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 pointer-events-none animate-[scanMove_6s_linear_infinite]"
        style={{
          background:
            "linear-gradient(90deg,transparent,rgba(139,92,246,0.35),transparent)",
        }}
      />

      {/* Film strips */}
      <div
        ref={ftRef}
        className="absolute top-0 left-0 right-0 h-12 flex items-center overflow-hidden film-strip film-strip-top"
      />
      <div
        ref={fbRef}
        className="absolute bottom-0 left-0 right-0 h-12 flex items-center overflow-hidden film-strip film-strip-bottom"
      />

      {/* Scanlines overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,rgba(255,255,255,0.012) 3px,rgba(255,255,255,0.012) 4px)",
        }}
      />

      {/* Corner brackets */}
      <div className="absolute top-4 left-4 w-5 h-5 border-t border-l border-[#1c1c1c]" />
      <div className="absolute top-4 right-4 w-5 h-5 border-t border-r border-[#1c1c1c]" />
      <div className="absolute bottom-4 left-4 w-5 h-5 border-b border-l border-[#1c1c1c]" />
      <div className="absolute bottom-4 right-4 w-5 h-5 border-b border-r border-[#1c1c1c]" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-lg 2xl:max-w-2xl px-8 flex flex-col items-center gap-4 sm:gap-4 2xl:gap-7">
        {/* Logo */}
        <img
          src={Logo}
          alt="CineGPT"
          className="w-52 sm:w-36 md:w-44 2xl:w-72 opacity-85"
          style={{ filter: "brightness(1.1)" }}
        />

        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] 2xl:text-sm font-medium tracking-[0.15em] uppercase text-[#6d6d6d] border border-[#1e1e1e] rounded-full px-3 sm:px-4 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-[blink_2s_ease-in-out_infinite]" />
          error · page not found
        </div>

        {/* 404 */}
        <div className="relative select-none leading-none">
          <span
            className="block text-[7rem] sm:text-[7rem] md:text-[8.5rem] 2xl:text-[13rem] font-bold tracking-[-0.04em] text-transparent"
            style={{ WebkitTextStroke: "1px #1a1a1a" }}
          >
            404
          </span>
          <span
            className="absolute inset-0 block text-[7rem] sm:text-[7rem] md:text-[8.5rem] 2xl:text-[13rem] font-bold tracking-[-0.04em] text-white"
            style={{
              animation: "revealText 1s cubic-bezier(0.77,0,0.18,1) 0.3s both",
              clipPath: "inset(0 100% 0 0)",
            }}
          >
            404
          </span>
        </div>

        <div className="w-10 2xl:w-16 h-px bg-[#1e1e1e]" />

        <div>
          <h1 className="text-xl sm:text-2xl 2xl:text-4xl font-bold text-white mb-1.5 2xl:mb-3 leading-tight">
            This scene got cut
          </h1>
          <p className="text-[#484848] text-xs sm:text-sm 2xl:text-base leading-relaxed max-w-xs 2xl:max-w-sm mx-auto">
            The page you're looking for doesn't exist — or was removed from the
            reel entirely.
          </p>
        </div>

        <div className="flex gap-2.5 justify-center flex-wrap">
          <button
            onClick={() => navigate("/browse")}
            className="px-6 2xl:px-9 py-2.5 2xl:py-3.5 bg-white text-[#080808] text-sm 2xl:text-base font-bold rounded-lg hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            Browse movies
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-6 2xl:px-9 py-2.5 2xl:py-3.5 text-[#505050] text-sm 2xl:text-base font-medium border border-[#1e1e1e] rounded-lg hover:border-[#333] hover:text-[#888] transition-all cursor-pointer"
          >
            Go back
          </button>
        </div>

        {/* Status */}
        <div className="flex flex-col items-center gap-2 pt-1">
          <div className="flex items-center gap-4 w-full max-w-xs 2xl:max-w-sm">
            <div className="flex-1 h-px bg-[#111]" />
            <span className="text-[10px] 2xl:text-xs text-[#252525] tracking-[0.1em] whitespace-nowrap">
              CINEGPT · SYSTEM STATUS
            </span>
            <div className="flex-1 h-px bg-[#111]" />
          </div>
          <div className="flex gap-2 justify-center flex-wrap">
            {[
              { dot: "bg-green-500", label: "API online", delay: "0s" },
              { dot: "bg-amber-500", label: "CDN partial", delay: "0.6s" },
              { dot: "bg-red-500", label: "Route missing", delay: "1.2s" },
            ].map(({ dot, label, delay }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 text-[10px] sm:text-[11px] 2xl:text-xs text-[#2d2d2d] border border-[#161616] rounded-full px-3 2xl:px-4 py-1 2xl:py-1.5"
              >
                <span
                  className={`w-1 h-1 rounded-full ${dot} animate-[blink_2s_ease-in-out_infinite]`}
                  style={{ animationDelay: delay }}
                />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap');

        @keyframes revealText {
          to { clip-path: inset(0 0% 0 0); }
        }

        @keyframes drift1 {
          0%,100% { transform: translate(0,0) scale(1); }
          25%      { transform: translate(30px,-25px) scale(1.08); }
          50%      { transform: translate(-15px,30px) scale(0.94); }
          75%      { transform: translate(20px,10px) scale(1.04); }
        }
        @keyframes drift2 {
          0%,100% { transform: translate(0,0) scale(1); }
          20%     { transform: translate(-25px,20px) scale(1.06); }
          55%     { transform: translate(18px,-28px) scale(0.92); }
          80%     { transform: translate(-10px,15px) scale(1.03); }
        }
        @keyframes drift3 {
          0%,100% { transform: translate(0,0) scale(1); }
          30%     { transform: translate(22px,18px) scale(1.1); }
          60%     { transform: translate(-20px,-20px) scale(0.9); }
        }
        @keyframes drift4 {
          0%,100% { transform: translate(0,0); }
          40%     { transform: translate(-30px,25px); }
          70%     { transform: translate(15px,-18px); }
        }
        @keyframes drift5 {
          0%,100% { transform: translate(0,0) scale(1); opacity: 0.05; }
          50%     { transform: translate(-20px,15px) scale(1.15); opacity: 0.09; }
        }

        @keyframes float1 {
          0%,100% { transform: translateY(0) translateX(0); opacity: 0.4; }
          50%     { transform: translateY(-20px) translateX(8px); opacity: 0.9; }
        }
        @keyframes float2 {
          0%,100% { transform: translateY(0) translateX(0); opacity: 0.2; }
          50%     { transform: translateY(-30px) translateX(-10px); opacity: 0.7; }
        }
        @keyframes float3 {
          0%,100% { transform: translateY(0); opacity: 0.3; }
          50%     { transform: translateY(-15px); opacity: 0.8; }
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.1; }
        }

        @keyframes gridPulse {
          0%,100% { opacity: 1; }
          50%     { opacity: 0.5; }
        }

        @keyframes scanMove {
          0%   { transform: translateY(-4px); }
          100% { transform: translateY(100vh); }
        }

        .film-strip {
          background: #1a1008;
          background-image:
            linear-gradient(rgba(255,200,80,0.04) 0px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.3) 0px, transparent 1px);
          background-size: 100% 2px, 8px 100%;
        }
        .film-strip-top  { border-bottom: 1.5px solid #2e1c0a; box-shadow: 0 2px 12px rgba(0,0,0,0.8); }
        .film-strip-bottom { border-top: 1.5px solid #2e1c0a; box-shadow: 0 -2px 12px rgba(0,0,0,0.8); }

        .fh {
          flex-shrink: 0;
          width: 16px;
          height: 22px;
          border-radius: 3px;
          margin: 0 7px;
          background: #080808;
          box-shadow:
            inset 0 1px 4px rgba(0,0,0,0.95),
            inset 0 -1px 2px rgba(0,0,0,0.7),
            0 0 0 1px rgba(255,160,40,0.12),
            0 1px 0 rgba(255,160,40,0.06);
        }
      `}</style>
    </div>
  );
};

export default NotFound;
