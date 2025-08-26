import React, { useState, useRef } from "react";
import Header from "./Header";
import { loginValidation } from "./loginValidations";

const Login = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const email = useRef();
  const password = useRef();
  const fullName = useRef();
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState([]);
  const [fullNameError, setFullNameError] = useState(null);

  const handleLogin = () => {
    if (isSignIn) {
      const { emailErr, passwordErr } = loginValidation(
        email.current.value,
        password.current.value
      );
      setEmailError(emailErr);
      setPasswordError(passwordErr);
    } else {
      const { emailErr, passwordErr, fullNameErr } = loginValidation(
        email.current.value,
        password.current.value,
        fullName.current.value
      );
      setEmailError(emailErr);
      setPasswordError(passwordErr);
      setFullNameError(fullNameErr);
    }
  };

  const handleSignUpClick = () => {
    setIsSignIn((prev) => !prev);

    if (email.current) email.current.value = "";
    if (password.current) password.current.value = "";
    if (fullName.current) fullName.current.value = "";

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
      <form
        onSubmit={(e) => e.preventDefault()}
        className="w-4/12 absolute bg-black/80 bg-opacity-50 
                 text-white p-10 my-24   mx-auto left-0 right-0 rounded-lg"
      >
        <h1 className="text-3xl mx-2 font-bold mb-6">
          {isSignIn ? "Sign In" : "Sign Up"}
        </h1>
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
            passwordError.map((err, index) => <li key={index}>{err}</li>)}
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
  );
};

export default Login;
