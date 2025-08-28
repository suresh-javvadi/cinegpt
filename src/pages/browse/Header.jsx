import React from "react";
import PROFILE_IMAGE from "../../assets/PROFILE_IMAGE.png";
import NETFLIX_LOGO from "../../assets/Netflix_Logo.png";
import { auth } from "../../firebase/firebaseConfig";
import { useNavigate } from "react-router";
import { signOut } from "firebase/auth";
import { useSelector } from "react-redux";

const Header = () => {
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
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
  );
};

export default Header;
