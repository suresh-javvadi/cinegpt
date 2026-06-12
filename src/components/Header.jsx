import React, { useEffect, useRef, useState } from "react";
import profileImage from "../assets/profile-img.png";
import Logo from "../assets/logo.webp";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate, useLocation } from "react-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { addUser, removeUser } from "../slices/userSlice";
import { toggleGptSearchView } from "../slices/gptSlice";
import { changeLanguage } from "../slices/configSlice";
import lang from "../utils/languagesConstants";
import { MOVIE_IMAGE_URL } from "../utils/constants";
import {
  getRecentlyViewed,
  removeRecentlyViewed,
  clearRecentlyViewed,
} from "../hooks/useRecentlyViewed";

const Header = () => {
  const selectedLang = useSelector((store) => store?.config?.lang);
  const showGptSearch = useSelector((store) => store?.gptSearch?.showGptSearch);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((store) => store.user);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [navVisible, setNavVisible] = useState(true);
  const dropdownRef = useRef(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const atBottom = y + window.innerHeight >= document.documentElement.scrollHeight - 10;
      if (y < 10 || atBottom) setNavVisible(true);
      else if (y < lastScrollY.current) setNavVisible(true);
      else setNavVisible(false);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isGptPage = location.pathname === "/gpt-search";
  const handleGptSearchView = () => navigate(isGptPage ? "/browse" : "/gpt-search");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, email, displayName } = user;
        dispatch(addUser({ uid, email, displayName }));
        if (location.pathname === "/") navigate("/browse");
      } else {
        dispatch(removeUser());
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSignOut = () => {
    setDropdownOpen(false);
    signOut(auth).catch(console.error);
  };

  const openHistory = () => {
    const items = getRecentlyViewed();
    setHistory(items);
    setHistoryIndex(0);
    setHistoryOpen(true);
    setDropdownOpen(false);
  };

  const handleHistoryRemove = (id) => {
    removeRecentlyViewed(id);
    setHistory((prev) => {
      const next = prev.filter((m) => m.id !== id);
      setHistoryIndex((i) => Math.min(i, Math.max(0, next.length - 1)));
      return next;
    });
  };

  const handleHistoryClear = () => {
    clearRecentlyViewed();
    setHistory([]);
  };

  const initials = user?.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : (user?.email?.[0]?.toUpperCase() ?? "U");

  const firstName = user?.displayName?.split(" ")[0] ?? null;

  return (
    <>
    <div
      className="fixed w-full z-40 bg-gradient-to-b from-black/95 via-black/50 to-transparent px-4 sm:px-8 pt-3 pb-10"
      style={{
        transform: navVisible ? "translateY(0)" : "translateY(-110%)",
        transition: "transform 0.32s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      {user ? (
        <div className="flex justify-between items-center">
          {/* Logo */}
          <img
            className="w-24 sm:w-32 md:w-40 object-contain cursor-pointer"
            src={Logo}
            alt="CineGPT"
            onClick={() => navigate("/browse")}
          />

          {/* Right controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
            {/* Search */}
            <button
              onClick={() => navigate("/search")}
              className="hidden sm:flex w-8 h-8 sm:w-9 sm:h-9 items-center justify-center rounded-full hover:bg-white/10 transition cursor-pointer"
            >
              <svg
                width="17"
                height="17"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
                className="text-white"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" strokeLinecap="round" />
              </svg>
            </button>

            {/* Trending */}
            <button
              onClick={() => navigate("/trending")}
              className="relative hidden sm:flex w-9 h-9 items-center justify-center rounded-full cursor-pointer group"
            >
              <span
                className="absolute inset-0 rounded-full bg-orange-500/40"
                style={{ animation: "ringPulse 2s ease-out infinite" }}
              />
              <span className="absolute inset-0 rounded-full bg-orange-500/10 group-hover:bg-orange-500/25 transition-colors duration-300" />
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="relative z-10 text-orange-400 group-hover:text-yellow-300 transition-colors duration-300"
                style={{
                  animation:
                    "flameDance 1.8s ease-in-out infinite, flameGlow 1.8s ease-in-out infinite",
                }}
              >
                <path d="M12 2C9 7 4 8.5 4 13a8 8 0 0016 0c0-2.5-1.5-4.5-3-6-1 2-2 2.5-3 2.5C15 7.5 12 2 12 2z" />
              </svg>
            </button>

            {/* GPT Search toggle */}
            <button
              onClick={handleGptSearchView}
              className={`hidden sm:flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                isGptPage
                  ? "bg-white text-black hover:bg-white/90"
                  : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-900/40"
              }`}
            >
              {isGptPage ? (
                <>
                  <svg
                    width="15"
                    height="15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                  <span className="hidden sm:inline">
                    {lang[selectedLang]?.homeBtn ?? "Home"}
                  </span>
                </>
              ) : (
                <>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                  </svg>
                  <span className="hidden sm:inline">GPT Search</span>
                </>
              )}
            </button>

            {/* Profile dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className={`flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl transition-all duration-200 cursor-pointer border ${
                  dropdownOpen
                    ? "bg-white/10 border-white/20"
                    : "bg-transparent border-transparent hover:bg-white/8 hover:border-white/10"
                }`}
              >
                <img
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover border border-white/20"
                  src={profileImage}
                  alt="profile"
                />
                {firstName && (
                  <span className="hidden sm:block text-sm text-gray-200 font-medium max-w-[80px] truncate">
                    {firstName}
                  </span>
                )}
                <svg
                  width="12"
                  height="12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  className={`text-gray-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                >
                  <path
                    d="M6 9l6 6 6-6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* Dropdown panel */}
              {dropdownOpen && (
                <div
                  className="fixed right-3 top-14 w-64 sm:absolute sm:right-0 sm:top-full sm:mt-2 sm:w-64 z-50"
                  style={{
                    animation: "dropIn 0.18s cubic-bezier(0.16,1,0.3,1) both",
                  }}
                >
                  {/* Glass card */}
                  <div className="rounded-2xl border border-white/10 bg-[#0f0f0f]/95 backdrop-blur-xl shadow-2xl shadow-black/60 overflow-hidden">
                    {/* User info */}
                    <div className="px-4 py-4 flex items-center gap-3 border-b border-white/6">
                      <div className="relative flex-shrink-0">
                        <img
                          src={profileImage}
                          alt="profile"
                          className="w-11 h-11 rounded-xl object-cover border border-white/15"
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0f0f0f]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-sm font-semibold truncate leading-tight">
                          {user.displayName ?? "User"}
                        </p>
                        <p className="text-gray-500 text-xs truncate mt-0.5">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {/* Nav links */}
                    <div className="px-2 py-2">
                      {[
                        {
                          label: "Browse",
                          path: "/browse",
                          icon: (
                            <svg
                              width="15"
                              height="15"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <rect x="3" y="3" width="7" height="7" rx="1" />
                              <rect x="14" y="3" width="7" height="7" rx="1" />
                              <rect x="3" y="14" width="7" height="7" rx="1" />
                              <rect x="14" y="14" width="7" height="7" rx="1" />
                            </svg>
                          ),
                        },
                        {
                          label: "Trending",
                          path: "/trending",
                          icon: (
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="text-orange-400"
                            >
                              <path d="M12 2C9 7 4 8.5 4 13a8 8 0 0016 0c0-2.5-1.5-4.5-3-6-1 2-2 2.5-3 2.5C15 7.5 12 2 12 2z" />
                            </svg>
                          ),
                        },
                        {
                          label: "Search",
                          path: "/search",
                          icon: (
                            <svg
                              width="15"
                              height="15"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <circle cx="11" cy="11" r="8" />
                              <path
                                d="m21 21-4.35-4.35"
                                strokeLinecap="round"
                              />
                            </svg>
                          ),
                        },
                      ].map(({ label, path, icon }) => (
                        <button
                          key={label}
                          onClick={() => {
                            navigate(path);
                            setDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/6 transition-all duration-150 cursor-pointer group"
                        >
                          <span className="text-gray-500 group-hover:text-gray-300 transition-colors">
                            {icon}
                          </span>
                          {label}
                          <svg
                            width="12"
                            height="12"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            className="ml-auto opacity-0 group-hover:opacity-40 transition-opacity"
                          >
                            <path d="M9 18l6-6-6-6" strokeLinecap="round" />
                          </svg>
                        </button>
                      ))}

                      {/* History */}
                      <button
                        onClick={openHistory}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/6 transition-all duration-150 cursor-pointer group"
                      >
                        <span className="text-gray-500 group-hover:text-gray-300 transition-colors">
                          <svg
                            width="15"
                            height="15"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <circle cx="12" cy="12" r="9" />
                            <path
                              d="M12 7v5l3 3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                        Watch History
                        {getRecentlyViewed().length > 0 && (
                          <span className="ml-auto text-[10px] bg-white/8 text-gray-500 px-1.5 py-0.5 rounded-full">
                            {getRecentlyViewed().length}
                          </span>
                        )}
                      </button>
                    </div>

                    {/* Sign out */}
                    <div className="px-2 pb-2 border-t border-white/6 pt-2">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-150 cursor-pointer group"
                      >
                        <svg
                          width="15"
                          height="15"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          className="text-red-500"
                        >
                          <path
                            d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-start">
          <img
            className="w-28 sm:w-36 md:w-44 object-contain"
            src={Logo}
            alt="CineGPT"
          />
        </div>
      )}

      {/* History modal — 3D coverflow carousel */}
      {historyOpen &&
        (() => {
          const active = history[historyIndex];
          const is2xl =
            typeof window !== "undefined" && window.innerWidth >= 1536;
          const R = is2xl ? 270 : 200;
          const stageH = is2xl ? 290 : 210;
          const cardW = is2xl ? "w-36" : "w-24";

          const getStyle = (distance) => {
            const angle = distance * 38;
            const rad = angle * (Math.PI / 180);
            const tx = Math.sin(rad) * R;
            const tz = (Math.cos(rad) - 1) * (R * 0.55);
            const ty = distance === 0 ? "calc(-50% - 10px)" : "-50%";
            const sc = Math.max(0.42, Math.cos(rad) * 0.58 + 0.42);
            const op =
              Math.abs(distance) > 2
                ? 0
                : Math.max(0.18, Math.cos(rad) * 0.82 + 0.18);
            return {
              transform: `translateX(calc(-50% + ${tx}px)) translateY(${ty}) translateZ(${tz}px) rotateY(${-angle}deg) scale(${sc})`,
              opacity: op,
              zIndex: Math.round(sc * 10),
              pointerEvents: op < 0.1 ? "none" : "auto",
              transition: "all 0.45s cubic-bezier(0.25,0.46,0.45,0.94)",
            };
          };

          return (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center px-4"
              style={{ animation: "fadeIn 0.15s ease both" }}
            >
              <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={() => setHistoryOpen(false)}
              />

              <div
                className="relative w-full max-w-md 2xl:max-w-xl bg-[#0c0c0c] border border-white/8 rounded-2xl shadow-2xl shadow-black overflow-hidden"
                style={{
                  animation: "popIn 0.22s cubic-bezier(0.16,1,0.3,1) both",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Top bar */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/6">
                  <div className="flex items-center gap-2">
                    <svg
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      className="text-gray-500"
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path
                        d="M12 7v5l3 3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-white text-sm font-semibold">
                      Watch History
                    </span>
                    {history.length > 0 && (
                      <span className="text-[10px] text-gray-600 bg-white/5 px-1.5 py-0.5 rounded-full">
                        {history.length}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {history.length > 0 && (
                      <button
                        onClick={handleHistoryClear}
                        className="text-[11px] text-gray-700 hover:text-red-400 transition cursor-pointer"
                      >
                        Clear all
                      </button>
                    )}
                    <button
                      onClick={() => setHistoryOpen(false)}
                      className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/8 text-gray-600 hover:text-white transition cursor-pointer"
                    >
                      <svg
                        width="12"
                        height="12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                      >
                        <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                </div>

                {history.length === 0 ? (
                  <div className="flex flex-col items-center gap-3 py-14 text-center">
                    <svg
                      width="38"
                      height="38"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      viewBox="0 0 24 24"
                      className="text-gray-800"
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path
                        d="M12 7v5l3 3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="text-gray-600 text-sm">
                      No watch history yet
                    </p>
                  </div>
                ) : (
                  <>
                    {/* 3D Bearing stage */}
                    <div
                      className="relative overflow-hidden"
                      style={{
                        height: stageH,
                        perspective: "700px",
                        perspectiveOrigin: "50% 50%",
                        background:
                          "radial-gradient(ellipse 50% 70% at 50% 55%, rgba(255,255,255,0.05) 0%, transparent 70%)",
                      }}
                    >
                      {/* Ambient glow under active card */}
                      <div
                        className="absolute left-1/2 -translate-x-1/2 bottom-3 rounded-full blur-2xl transition-all duration-500"
                        style={{
                          width: is2xl ? 120 : 80,
                          height: is2xl ? 32 : 22,
                          background: "rgba(255,255,255,0.18)",
                        }}
                      />

                      {history.map((movie, i) => {
                        const distance = i - historyIndex;
                        if (Math.abs(distance) > 3) return null;
                        const isCenter = distance === 0;

                        return (
                          <div
                            key={movie.id}
                            className="absolute top-1/2 left-1/2 cursor-pointer"
                            style={getStyle(distance)}
                            onClick={() =>
                              isCenter
                                ? (navigate(`/movie/${movie.id}`),
                                  setHistoryOpen(false))
                                : setHistoryIndex(i)
                            }
                          >
                            <div
                              className={`${cardW} aspect-[2/3] rounded-xl overflow-hidden`}
                              style={{
                                boxShadow: isCenter
                                  ? "0 24px 70px rgba(0,0,0,0.95), 0 0 0 2px rgba(255,255,255,0.35), 0 0 40px rgba(255,255,255,0.08)"
                                  : "0 8px 24px rgba(0,0,0,0.7)",
                              }}
                            >
                              <img
                                src={MOVIE_IMAGE_URL + movie.poster_path}
                                alt={movie.title}
                                className="w-full h-full object-cover"
                                draggable={false}
                              />
                            </div>
                            {/* "Tap to open" hint on center */}
                            {isCenter && (
                              <div className="absolute inset-x-0 bottom-0 h-12 flex items-end justify-center pb-2 bg-gradient-to-t from-black/60 to-transparent rounded-b-xl pointer-events-none">
                                <span className="text-[9px] text-white/50 tracking-widest uppercase">
                                  tap to open
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {/* Prev arrow */}
                      {historyIndex > 0 && (
                        <button
                          onClick={() => setHistoryIndex((i) => i - 1)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white/6 hover:bg-white/14 border border-white/8 flex items-center justify-center text-gray-400 hover:text-white transition cursor-pointer"
                        >
                          <svg
                            width="12"
                            height="12"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M15 18l-6-6 6-6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      )}
                      {/* Next arrow */}
                      {historyIndex < history.length - 1 && (
                        <button
                          onClick={() => setHistoryIndex((i) => i + 1)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white/6 hover:bg-white/14 border border-white/8 flex items-center justify-center text-gray-400 hover:text-white transition cursor-pointer"
                        >
                          <svg
                            width="12"
                            height="12"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M9 18l6-6-6-6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      )}
                    </div>

                    {/* Selected movie info */}
                    {active && (
                      <div className="px-5 2xl:px-8 pb-5 2xl:pb-7 pt-3 2xl:pt-4 text-center border-t border-white/5">
                        <p className="text-white font-semibold text-sm 2xl:text-base truncate">
                          {active.title}
                        </p>
                        <div className="flex items-center justify-center gap-3 mt-1 mb-3.5">
                          {active.release_date && (
                            <span className="text-gray-600 text-xs 2xl:text-sm">
                              {active.release_date.slice(0, 4)}
                            </span>
                          )}
                          {active.vote_average > 0 && (
                            <span className="text-yellow-500 text-xs 2xl:text-sm font-medium">
                              ★{" "}
                              {(
                                Math.round(active.vote_average * 10) / 10
                              ).toFixed(1)}
                            </span>
                          )}
                        </div>

                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => {
                              navigate(`/movie/${active.id}`);
                              setHistoryOpen(false);
                            }}
                            className="flex items-center gap-1.5 px-5 2xl:px-7 py-2 2xl:py-2.5 bg-white text-black text-xs 2xl:text-sm font-bold rounded-lg hover:bg-white/90 transition cursor-pointer"
                          >
                            <svg
                              width="11"
                              height="11"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                            Watch
                          </button>
                          <button
                            onClick={() => handleHistoryRemove(active.id)}
                            className="flex items-center gap-1.5 px-4 2xl:px-6 py-2 2xl:py-2.5 bg-white/5 hover:bg-red-500/15 text-gray-500 hover:text-red-400 text-xs 2xl:text-sm font-medium rounded-lg border border-white/6 hover:border-red-500/20 transition cursor-pointer"
                          >
                            <svg
                              width="11"
                              height="11"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M18 6L6 18M6 6l12 12"
                                strokeLinecap="round"
                              />
                            </svg>
                            Remove
                          </button>
                        </div>

                        {/* Dots */}
                        <div className="flex justify-center gap-1.5 mt-4">
                          {history.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setHistoryIndex(i)}
                              className="rounded-full transition-all duration-300 cursor-pointer"
                              style={{
                                width: i === historyIndex ? 16 : 6,
                                height: 6,
                                background:
                                  i === historyIndex
                                    ? "#fff"
                                    : "rgba(255,255,255,0.15)",
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })()}

      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: scale(0.95) translateY(-6px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
      `}</style>
    </div>

      {/* ── Bottom nav — outside the transformed header div so fixed positioning works ── */}
      {user && (
        <nav
          className="fixed bottom-0 left-0 right-0 sm:hidden z-50"
          style={{
            paddingBottom: "env(safe-area-inset-bottom, 0px)",
            transform: navVisible ? "translateY(0)" : "translateY(110%)",
            transition: "transform 0.32s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          <div className="flex bg-gradient-to-t from-black/95 via-black/80 to-black/60 backdrop-blur-2xl border-t border-white/[0.07]">
            {[
              {
                label: "Home",
                path: "/browse",
                activeColor: "text-sky-400",
                inactiveColor: "text-sky-800",
                pillColor: "bg-sky-500/15",
                activeIcon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                  </svg>
                ),
                inactiveIcon: (
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" />
                    <polyline points="9 22 9 12 15 12 15 22" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
              },
              {
                label: "Search",
                path: "/search",
                activeColor: "text-white",
                inactiveColor: "text-gray-600",
                pillColor: "bg-white/10",
                activeIcon: (
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" strokeLinecap="round" />
                  </svg>
                ),
                inactiveIcon: (
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" strokeLinecap="round" />
                  </svg>
                ),
              },
              {
                label: "Trending",
                path: "/trending",
                activeColor: "text-orange-400",
                inactiveColor: "text-orange-800",
                pillColor: "bg-orange-500/15",
                activeIcon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C9 7 4 8.5 4 13a8 8 0 0016 0c0-2.5-1.5-4.5-3-6-1 2-2 2.5-3 2.5C15 7.5 12 2 12 2z" />
                  </svg>
                ),
                inactiveIcon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C9 7 4 8.5 4 13a8 8 0 0016 0c0-2.5-1.5-4.5-3-6-1 2-2 2.5-3 2.5C15 7.5 12 2 12 2z" />
                  </svg>
                ),
              },
              {
                label: "GPT",
                path: "/gpt-search",
                activeColor: "text-purple-400",
                inactiveColor: "text-purple-800",
                pillColor: "bg-purple-500/15",
                activeIcon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                  </svg>
                ),
                inactiveIcon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                  </svg>
                ),
              },
            ].map(({ label, path, activeIcon, inactiveIcon, activeColor, inactiveColor, pillColor }) => {
              const active = location.pathname === path;
              const color = active ? (activeColor ?? "text-white") : (inactiveColor ?? "text-gray-600");
              return (
                <button
                  key={label}
                  onClick={() => navigate(path)}
                  className="flex-1 flex flex-col items-center gap-[3px] py-2.5 cursor-pointer active:scale-90 transition-transform duration-100"
                >
                  <div className={`px-3.5 py-1.5 rounded-2xl transition-all duration-200 ${active ? pillColor : "bg-transparent"}`}>
                    <span className={`${color} transition-colors duration-200 block`}>
                      {active ? activeIcon : inactiveIcon}
                    </span>
                  </div>
                  <span className={`text-[10px] font-semibold tracking-wide transition-colors duration-200 ${color}`}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
};

export default Header;
