import React, { useState, useRef } from "react";
import Header from "../../components/Header";
import { validateSignIn, validateSignUp } from "./loginValidations";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { getFirebaseErrorMessage } from "../../firebase/firebaseErrors";
import { useDispatch } from "react-redux";
import { addUser } from "../../slices/userSlice";
import LOGIN_BG_IMG from "../../assets/Login_Bg.jpg";

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
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLogin = () => {
    if (isSignIn) {
      const { emailErr, passwordErr } = validateSignIn(
        email.current.value,
        password.current.value,
      );
      setEmailError(emailErr);
      setPasswordError(passwordErr);

      if (emailErr || passwordErr) return;
    } else {
      const { emailErr, passwordErr, fullNameErr } = validateSignUp(
        email.current.value,
        password.current.value,
        fullName.current.value,
      );
      setEmailError(emailErr);
      setPasswordError(passwordErr);
      setFullNameError(fullNameErr);

      if (emailErr || passwordErr || fullNameErr) return;
    }
    setIsLoading(true);
    if (isSignIn) {
      signInWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value,
      )
        .then(() => {
          setIsSuccess(true);
          setTimeout(() => {
            // redirect after animation finishes
            // navigate("/browse")
          }, 3000);
        })
        .catch((error) => {
          setIsLoading(false);
          setIsSuccess(false);
          setErrorMsg(getFirebaseErrorMessage(error.code));
          password.current.value = "";
        });

      return;
    }
    createUserWithEmailAndPassword(
      auth,
      email.current.value,
      password.current.value,
    )
      .then((userCredential) => {
        const user = userCredential.user;
        return updateProfile(user, {
          displayName: fullName.current.value,
        });
      })
      .then(() => {
        const { uid, email, displayName } = auth.currentUser;

        dispatch(
          addUser({
            uid,
            email,
            displayName,
          }),
        );
        setIsSuccess(true);

        setTimeout(() => {
          // navigate("/browse");
        }, 3000);
      })
      .catch((error) => {
        setIsLoading(false);
        setIsSuccess(false);
        setErrorMsg(getFirebaseErrorMessage(error.code));
      });
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
            onClick={handleLogin}
            disabled={isLoading}
            className={`
                relative 
                flex items-center justify-center 
                bg-red-600 text-white font-semibold
                rounded-lg transition-all duration-300
                ${isLoading ? "w-12 h-12 rounded-full p-0" : "w-full p-3 mt-4"}
                ${isSuccess ? "bg-green-600" : ""}
                disabled:opacity-70 disabled:cursor-not-allowed
              `}
          >
            {isLoading && !isSuccess && (
              <span className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></span>
            )}

            {isSuccess && (
              <svg
                className="w-8 h-8 animate-bounce"
                fill="none"
                stroke="white"
                strokeWidth="4"
                viewBox="0 0 24 24"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            )}

            {!isLoading && !isSuccess && (
              <span>{isSignIn ? "Sign In" : "Sign Up"}</span>
            )}
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
