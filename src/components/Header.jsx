import React, { useEffect } from "react";
import PROFILE_IMAGE from "../assets/PROFILE_IMAGE.png";
import NETFLIX_LOGO from "../assets/Netflix_Logo.png";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { addUser, removeUser } from "../slices/userSlice";
import { LOGO } from "../utils/constants";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);

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
          <div className="flex">
            <img
              className="w-10 mx-2 rounded-lg"
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
