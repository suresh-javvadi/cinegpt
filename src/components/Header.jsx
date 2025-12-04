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

  console.log(selectedLang);
  console.log(lang[selectedLang]);

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
    <div className="absolute bg-gradient-to-b from-black w-full z-10">
      {user ? (
        <div className="flex justify-between items-center pl-8 pr-2 py-2">
          <img className="w-1/12" src={NETFLIX_LOGO} alt="logo" />
          <div className="flex gap-4">
            {showGptSearch && (
              <select
                name="lang-select"
                onChange={handleLanguageChange}
                className="bg-gray-600 rounded-lg px-4"
              >
                {LANGUAGE_OPTIONS.map((lang) => (
                  <option value={lang.value}>{lang.name}</option>
                ))}
              </select>
            )}
            <button
              className="px-4 bg-purple-700 rounded-lg cursor-pointer"
              onClick={handleGptSearchView}
            >
              {showGptSearch ? lang[selectedLang]?.homeBtn : "GPT Search"}
            </button>
            <img
              className="w-10 rounded-lg"
              src={PROFILE_IMAGE}
              alt="profile"
            />
            <button
              className="bg-black text-white font-bold rounded-lg p-2 cursor-pointer"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </div>
        </div>
      ) : (
        <div>
          <img className="w-2/12" src={NETFLIX_LOGO} alt="logo" />
        </div>
      )}
    </div>
  );
};

export default Header;
