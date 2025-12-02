import React, { useEffect } from "react";
import PROFILE_IMAGE from "../assets/PROFILE_IMAGE.png";
import NETFLIX_LOGO from "../assets/Netflix_Logo.png";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { addUser, removeUser } from "../slices/userSlice";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
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
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {})
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <div>
      {user ? (
        <div className="flex justify-between items-center pl-8 pr-2 py-2 bg-gradient-to-b from-black w-full z-10">
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
          <div>
            <div className="absolute px-8 bg-gradient-to-b from-black w-full z-10">
              <img
                className="w-2/12"
                src="https://help.nflxext.com/helpcenter/OneTrust/oneTrust_production_2025-07-24/consent/87b6a5c0-0104-4e96-a291-092c11350111/019808e2-d1e7-7c0f-ad43-c485b7d9a221/logos/dd6b162f-1a32-456a-9cfe-897231c7763c/4345ea78-053c-46d2-b11e-09adaef973dc/Netflix_Logo_PMS.png"
                alt="logo"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
