import React, { useState, useRef } from "react";
import Header from "../../components/Header";
import { loginValidation } from "./loginValidations";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { getFirebaseErrorMessage } from "../../firebase/firebaseErrors";
import { useDispatch } from "react-redux";
import { addUser } from "../../slices/userSlice";
import { LOGIN_BG_IMG } from "../../utils/constants";

const Login = () => {
  const dispatch = useDispatch();
  const [isSignIn, setIsSignIn] = useState(true);
  const email = useRef();
  const password = useRef();
  const fullName = useRef();
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState([]);
  const [fullNameError, setFullNameError] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleLogin = () => {
    if (isSignIn) {
      const { emailErr, passwordErr } = loginValidation(
        email.current.value,
        password.current.value
      );
      setEmailError(emailErr);
      setPasswordError(passwordErr);

      if (emailErr || passwordErr) return;

      signInWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value
      )
        .then(() => {})
        .catch((error) => {
          setErrorMsg(getFirebaseErrorMessage(error.code));
          password.current.value = "";
        });
    } else {
      const { emailErr, passwordErr, fullNameErr } = loginValidation(
        email.current.value,
        password.current.value,
        fullName.current.value
      );
      setEmailError(emailErr);
      setPasswordError(passwordErr);
      setFullNameError(fullNameErr);

      if (emailErr || passwordErr || fullNameErr) return;

      createUserWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value
      )
        .then((userCredential) => {
          const user = userCredential.user;
          updateProfile(user, {
            displayName: fullName.current.value,
          })
            .then(() => {
              const { uid, email, displayName } = auth.currentUser;

              dispatch(
                addUser({
                  uid: uid,
                  email: email,
                  displayName: displayName,
                })
              );
            })
            .catch((error) => {
              console.error("Profile update error:", error.message);
              setErrorMsg("Failed to update profile. Please try again.");
            });
        })
        .catch((error) => {
          setErrorMsg(getFirebaseErrorMessage(error.code));
        });
    }
  };

  const handleSignUpClick = () => {
    setIsSignIn((prev) => !prev);

    if (email.current) email.current.value = "";
    if (password.current) password.current.value = "";
    if (fullName.current) fullName.current.value = "";
    if (errorMsg) setErrorMsg("");

    setEmailError(null);
    setPasswordError(null);
    setFullNameError(null);
  };

  return (
    <div className="relative min-h-screen w-full">
      <Header />
      <div className="absolute inset-0 -z-10">
        <img
          src={LOGIN_BG_IMG}
          alt="background Image"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="min-h-screen flex items-center justify-center px-4">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="
        w-full
        max-w-sm               
        sm:max-w-md           
        md:max-w-lg          
        xl:max-w-md           
        bg-black/80 text-white p-8 sm:p-10 rounded-lg"
        >
          <h1 className="text-3xl font-bold mb-6">
            {isSignIn ? "Sign In" : "Sign Up"}
          </h1>
          {errorMsg && (
            <p className="bg-yellow-500/70 p-4 mb-4 rounded-md text-black">
              {errorMsg}
            </p>
          )}
          {!isSignIn && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                ref={fullName}
                className="mb-2 p-3 border border-gray-400 w-full rounded"
              />
              <p className="text-red-500 text-sm mb-2">{fullNameError}</p>
            </>
          )}

          <input
            type="text"
            placeholder="Email"
            ref={email}
            className="mb-2 p-3 border border-gray-400 w-full rounded"
          />
          <p className="text-red-500 text-sm mb-2">{emailError}</p>

          <input
            type="password"
            placeholder="Password"
            ref={password}
            className="mb-2 p-3 border border-gray-400 w-full rounded"
          />
          <div className="text-red-500 text-sm">
            {passwordError &&
              passwordError.map((err, index) => <p key={index}>{err}</p>)}
          </div>

          <button
            className="
          bg-red-600 w-full p-3 rounded mt-4
          hover:bg-red-700 transition
        "
            onClick={handleLogin}
          >
            {isSignIn ? "Sign In" : "Sign Up"}
          </button>

          <p className="mt-6 text-center text-sm">
            <span className="text-gray-400">
              {isSignIn ? "New to Netflix?" : "Already a user?"}
            </span>
            <span
              className="underline cursor-pointer ml-1 font-bold"
              onClick={handleSignUpClick}
            >
              {isSignIn ? "Sign up now." : "Sign in now."}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
