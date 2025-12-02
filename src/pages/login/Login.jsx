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
              console.log("Profile update error:", error.message);
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
    <div>
      <Header />
      <div className="absolute">
        <img
          src="https://assets.nflxext.com/ffe/siteui/vlv3/3e4bd046-85a3-40e1-842d-fa11cec84349/web/IN-en-20250818-TRIFECTA-perspective_4bd1b66d-bbb6-4bc6-ba8f-ecbba53a1278_medium.jpg"
          alt="background Image"
        />
      </div>
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="absolute w-4/12 2xl:w-3/12 bg-black/80 text-white p-10 rounded-lg"
        >
          <h1 className="text-3xl mx-2 font-bold mb-6">
            {isSignIn ? "Sign In" : "Sign Up"}
          </h1>
          {errorMsg && (
            <p className="bg-yellow-500/80 p-4 m-2 w-full rounded-md text-black">
              {errorMsg}
            </p>
          )}
          {!isSignIn && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                ref={fullName}
                className="m-2 p-4 border border-gray-400 w-full"
              />
              <p className="text-red-500 px-2">
                {fullNameError && fullNameError}
              </p>
            </>
          )}
          <input
            type="text"
            placeholder="Email"
            ref={email}
            className="m-2 p-4 border border-gray-400 w-full"
          />
          <p className="text-red-500 px-2">{emailError && emailError}</p>
          <input
            type="password"
            placeholder="Password"
            ref={password}
            className="m-2 p-4 border border-gray-400 w-full"
          />
          <p className="text-red-500 px-2">
            {passwordError &&
              (passwordError.length === 1
                ? passwordError.map((err, index) => <p key={index}>{err}</p>)
                : passwordError.map((err, index) => (
                    <li key={index}>{err}</li>
                  )))}
          </p>
          <button
            className="bg-red-600 w-full p-2 m-2 rounded my-4 cursor-pointer"
            onClick={handleLogin}
          >
            {isSignIn ? "Sign In" : "Sign Up"}
          </button>

          <p className="mx-2 mt-4">
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
