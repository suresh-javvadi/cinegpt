import React, { useEffect } from "react";
import PROFILE_IMAGE from "../assets/PROFILE_IMAGE.png";
import NETFLIX_LOGO from "../assets/Netflix_Logo.png";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { addUser, removeUser } from "../slices/userSlice";
import { LANGUAGE_OPTIONS, LOGO } from "../utils/constants";
import { toggleGptSearchView } from "../slices/gptSlice";
import { changeLanguage } from "../slices/configSlice";
import lang from "../utils/languagesConstants";

const Header = () => {
  const selectedLang = useSelector((store) => store?.config?.lang);
  const showGptSearch = useSelector((store) => store?.gptSearch?.showGptSearch);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);

  const handleLanguageChange = (e) => {
    dispatch(changeLanguage(e.target.value));
  };

  const handleGptSearchView = () => {
    dispatch(toggleGptSearchView());
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, email, displayName } = user;
        dispatch(
          addUser({
            uid: uid,
            email: email,
            displayName: displayName,
          })
        );
        navigate("/browse");
      } else {
        dispatch(removeUser());
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {})
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="absolute w-full z-10 bg-gradient-to-b from-black px-4 py-2">
      {user ? (
        <div className="flex justify-between items-center">
          <img className="w-24 sm:w-32 md:w-40" src={NETFLIX_LOGO} alt="logo" />
          <div className="flex items-center gap-2 sm:gap-4">
            {showGptSearch && (
              <select
                name="lang-select"
                onChange={handleLanguageChange}
                className="bg-gray-600 rounded-lg px-3 py-1 text-sm sm:text-base"
              >
                {LANGUAGE_OPTIONS.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.name}
                  </option>
                ))}
              </select>
            )}

            <button
              className="px-3 py-1 sm:px-4 bg-purple-700 rounded-lg text-sm sm:text-base"
              onClick={handleGptSearchView}
            >
              {showGptSearch ? lang[selectedLang]?.homeBtn : "GPT Search"}
            </button>
            <img
              className="w-8 sm:w-10 rounded-lg"
              src={PROFILE_IMAGE}
              alt="profile"
            />
            <button
              className="bg-black text-white font-bold rounded-lg px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center sm:justify-start">
          <img className="w-56 sm:w-48 md:w-56" src={NETFLIX_LOGO} alt="logo" />
        </div>
      )}
    </div>
  );
};

export default Header;
