import React, { useEffect } from "react";
import profileImage from "../assets/profile-img.png";
import Logo from "../assets/logo.webp";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { addUser, removeUser } from "../slices/userSlice";
import { LANGUAGE_OPTIONS } from "../utils/constants";
import { toggleGptSearchView } from "../slices/gptSlice";
import { changeLanguage } from "../slices/configSlice";
import lang from "../utils/languagesConstants";

const Header = () => {
  const selectedLang = useSelector((store) => store?.config?.lang);
  const showGptSearch = useSelector((store) => store?.gptSearch?.showGptSearch);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);

  const handleLanguageChange = (e) => dispatch(changeLanguage(e.target.value));
  const handleGptSearchView = () => dispatch(toggleGptSearchView());

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, email, displayName } = user;
        dispatch(addUser({ uid, email, displayName }));
        navigate("/browse");
      } else {
        dispatch(removeUser());
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
    signOut(auth).catch(console.error);
  };

  return (
    <div className="absolute w-full z-20 bg-gradient-to-b from-black/95 via-black/50 to-transparent px-4 sm:px-8 pt-3 pb-10">
      {user ? (
        <div className="flex justify-between items-center">
          {/* Logo */}
          <img
            className="w-24 sm:w-32 md:w-40 object-contain"
            src={Logo}
            alt="CineGPT"
          />

          {/* Right controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language selector — only in GPT mode */}
            {showGptSearch && (
              <select
                onChange={handleLanguageChange}
                className="bg-black/60 border border-white/20 text-white rounded-lg px-3 py-1.5 text-sm backdrop-blur-sm focus:outline-none focus:border-white/50 transition cursor-pointer"
              >
                {LANGUAGE_OPTIONS.map((l) => (
                  <option key={l.value} value={l.value} className="bg-black">
                    {l.name}
                  </option>
                ))}
              </select>
            )}

            {/* GPT Search toggle */}
            <button
              onClick={handleGptSearchView}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                showGptSearch
                  ? "bg-white text-black hover:bg-white/90"
                  : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-900/40"
              }`}
            >
              {showGptSearch ? (
                <>
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                  <span className="hidden sm:inline">{lang[selectedLang]?.homeBtn ?? "Home"}</span>
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                  </svg>
                  <span className="hidden sm:inline">GPT Search</span>
                </>
              )}
            </button>

            {/* Profile */}
            <div className="flex items-center gap-2">
              {user.displayName && (
                <span className="hidden md:block text-sm text-gray-200 font-medium">
                  {user.displayName.split(" ")[0]}
                </span>
              )}
              <img
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg object-cover border border-white/20"
                src={profileImage}
                alt="profile"
              />
            </div>

            {/* Sign out */}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 bg-black/50 border border-white/20 hover:bg-red-600/80 hover:border-red-500 text-white text-sm px-3 py-1.5 rounded-lg transition-all duration-200 backdrop-blur-sm cursor-pointer"
            >
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
              <span className="hidden sm:inline">Sign out</span>
            </button>
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
    </div>
  );
};

export default Header;
