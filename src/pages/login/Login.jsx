import React, { useState, useRef, useEffect } from "react";
import Header from "../../components/Header";
import { validateSignIn, validateSignUp } from "./loginValidations";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { getFirebaseErrorMessage } from "../../firebase/firebaseErrors";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { addUser } from "../../slices/userSlice";
import loginBg from "../../assets/login-bg.webp";

// mode: "signin" | "signup" | "forgot"

const INPUT_CLASS =
  "w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50 focus:bg-white/[0.08] transition-all duration-300 text-sm tracking-wide";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mode, setMode] = useState("signin");

  const email = useRef();
  const password = useRef();
  const fullName = useRef();
  const forgotEmail = useRef();

  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [fullNameError, setFullNameError] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [forgotStatus, setForgotStatus] = useState(null); // null | "loading" | "sent" | "error"
  const [forgotError, setForgotError] = useState(null);
  const [bgLoaded, setBgLoaded] = useState(false);

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setBgLoaded(true);
    img.src = loginBg;
  }, []);

  const clearFormState = () => {
    setErrorMsg(null);
    setEmailError(null);
    setPasswordError(null);
    setFullNameError(null);
    setIsLoading(false);
    setIsSuccess(false);
  };

  const switchMode = (next) => {
    if (mode === next) return;
    setMode(next);
    clearFormState();
    setForgotStatus(null);
    setForgotError(null);
    if (email.current) email.current.value = "";
    if (password.current) password.current.value = "";
    if (fullName.current) fullName.current.value = "";
    if (forgotEmail.current) forgotEmail.current.value = "";
  };

  const handleLogin = () => {
    if (mode === "signin") {
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

    if (mode === "signin") {
      signInWithEmailAndPassword(auth, email.current.value, password.current.value)
        .then(() => {
          const { uid, email: userEmail, displayName } = auth.currentUser;
          dispatch(addUser({ uid, email: userEmail, displayName }));
          setIsSuccess(true);
          navigate("/browse", { replace: true });
        })
        .catch((error) => {
          setIsLoading(false);
          setErrorMsg(getFirebaseErrorMessage(error.code));
          password.current.value = "";
        });
      return;
    }

    createUserWithEmailAndPassword(auth, email.current.value, password.current.value)
      .then((userCredential) =>
        updateProfile(userCredential.user, { displayName: fullName.current.value }),
      )
      .then(() => {
        const { uid, email: userEmail, displayName } = auth.currentUser;
        dispatch(addUser({ uid, email: userEmail, displayName }));
        setIsSuccess(true);
        navigate("/browse", { replace: true });
      })
      .catch((error) => {
        setIsLoading(false);
        setErrorMsg(getFirebaseErrorMessage(error.code));
      });
  };

  const handleForgotPassword = () => {
    const val = forgotEmail.current?.value?.trim();
    if (!val) {
      setForgotError("Please enter your email address.");
      return;
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(val)) {
      setForgotError("That doesn't look like a valid email.");
      return;
    }
    setForgotError(null);
    setForgotStatus("loading");
    sendPasswordResetEmail(auth, val)
      .then(() => setForgotStatus("sent"))
      .catch((error) => {
        setForgotStatus("error");
        if (error.code === "auth/user-not-found") {
          setForgotError("No account found with this email.");
        } else if (error.code === "auth/invalid-email") {
          setForgotError("That doesn't look like a valid email.");
        } else if (error.code === "auth/too-many-requests") {
          setForgotError("Too many attempts. Please try again later.");
        } else {
          setForgotError("Something went wrong. Please try again.");
        }
      });
  };

  const isSignIn = mode === "signin";

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Fallback gradient — always visible instantly */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-neutral-950 to-black" />
      {/* Actual background image — fades in once loaded */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${loginBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          opacity: bgLoaded ? 1 : 0,
          transition: "opacity 0.9s ease",
        }}
      />
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-gradient-to-br from-red-950/25 via-transparent to-black/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

      <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" style={{ zIndex: 1 }}>
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>

      <Header />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">

          {/* Headline — outside card */}
          <div className="text-center mb-8">
            <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight leading-tight">
              {mode === "forgot" ? (
                <><span style={{ fontFamily: "'Great Vibes', cursive", fontWeight: 400 }}>Reset your</span><br /><span className="text-red-500">password</span></>
              ) : isSignIn ? (
                <><span style={{ fontFamily: "'Great Vibes', cursive", fontWeight: 400 }}>Welcome</span><br /><span className="text-red-500">back</span></>
              ) : (
                <><span style={{ fontFamily: "'Great Vibes', cursive", fontWeight: 400 }}>Join</span><br /><span className="text-red-500">CineGPT</span></>
              )}
            </h1>
            <p className="text-gray-400 text-sm mt-3 leading-relaxed">
              {mode === "forgot"
                ? "We'll send a reset link to your inbox."
                : isSignIn
                ? "Your AI-powered movie universe awaits."
                : "Discover movies with the power of AI."}
            </p>
          </div>

          {/* Card */}
          <div
            className="rounded-2xl p-7 sm:p-9 shadow-2xl"
            style={{
              background: "rgba(10, 10, 10, 0.72)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            {/* ── FORGOT PASSWORD VIEW ── */}
            {mode === "forgot" && (
              <>
                {forgotStatus === "sent" ? (
                  /* Success state */
                  <div className="text-center py-4">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                      style={{ background: "rgba(22,163,74,0.15)", border: "1px solid rgba(22,163,74,0.3)" }}
                    >
                      <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2">Check your inbox</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-1">
                      If an account exists for
                    </p>
                    <p className="text-white/80 text-sm font-medium mb-2">
                      {forgotEmail.current?.value}
                    </p>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                      you'll receive a password reset link shortly.
                    </p>
                    <p className="text-gray-500 text-xs mb-7">
                      Didn't receive it? Double-check the email or look in your spam folder.
                    </p>
                    <button
                      type="button"
                      onClick={() => switchMode("signin")}
                      className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200"
                      style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
                    >
                      Back to Sign In
                    </button>
                  </div>
                ) : (
                  /* Input state */
                  <form onSubmit={(e) => { e.preventDefault(); handleForgotPassword(); }}>
                    <div className="mb-5">
                      <label className="block text-xs font-medium text-gray-400 mb-1.5 tracking-wide">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        ref={forgotEmail}
                        autoComplete="email"
                        className={INPUT_CLASS}
                      />
                      {forgotError && (
                        <p className="text-red-400/90 text-xs mt-1.5 flex items-center gap-1">
                          <span>•</span> {forgotError}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={forgotStatus === "loading"}
                      className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-semibold text-white text-sm transition-all duration-300 cursor-pointer active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{
                        background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                        boxShadow: "0 8px 32px rgba(220,38,38,0.35)",
                      }}
                    >
                      {forgotStatus === "loading" && (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      )}
                      {forgotStatus === "loading" ? "Sending…" : "Send Reset Link"}
                    </button>

                    <button
                      type="button"
                      onClick={() => switchMode("signin")}
                      className="w-full mt-3 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200 flex items-center justify-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Back to Sign In
                    </button>
                  </form>
                )}
              </>
            )}

            {/* ── SIGN IN / SIGN UP VIEW ── */}
            {mode !== "forgot" && (
              <>
                {/* Tab switcher */}
                <div
                  className="flex mb-7 p-1 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <button
                    type="button"
                    onClick={() => switchMode("signin")}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      isSignIn
                        ? "bg-red-600 text-white shadow-lg shadow-red-900/40"
                        : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => switchMode("signup")}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      !isSignIn
                        ? "bg-red-600 text-white shadow-lg shadow-red-900/40"
                        : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Firebase error */}
                {errorMsg && (
                  <div
                    className="flex items-start gap-3 p-4 mb-5 rounded-xl text-sm"
                    style={{ background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.2)" }}
                  >
                    <span className="text-yellow-400 mt-0.5 shrink-0">⚠</span>
                    <span className="text-yellow-300/90">{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-4">
                  {!isSignIn && (
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5 tracking-wide">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        ref={fullName}
                        autoComplete="name"
                        className={INPUT_CLASS}
                      />
                      {fullNameError && (
                        <p className="text-red-400/90 text-xs mt-1.5 flex items-center gap-1">
                          <span>•</span> {fullNameError}
                        </p>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5 tracking-wide">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      ref={email}
                      autoComplete="email"
                      className={INPUT_CLASS}
                    />
                    {emailError && (
                      <p className="text-red-400/90 text-xs mt-1.5 flex items-center gap-1">
                        <span>•</span> {emailError}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-medium text-gray-400 tracking-wide">
                        Password
                      </label>
                      {isSignIn && (
                        <button
                          type="button"
                          onClick={() => switchMode("forgot")}
                          className="text-xs text-red-400/80 hover:text-red-400 transition-colors duration-200"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      ref={password}
                      autoComplete={isSignIn ? "current-password" : "new-password"}
                      className={INPUT_CLASS}
                    />
                    {passwordError && (
                      <div className="text-red-400/90 text-xs mt-1.5 space-y-0.5">
                        {passwordError.map((err, i) => (
                          <p key={i} className="flex items-center gap-1">
                            <span>•</span> {err}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="relative w-full mt-2 flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-semibold text-white text-sm transition-all duration-300 cursor-pointer active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{
                      background: isSuccess
                        ? "linear-gradient(135deg, #16a34a, #15803d)"
                        : "linear-gradient(135deg, #dc2626, #b91c1c)",
                      boxShadow: isSuccess
                        ? "0 8px 32px rgba(22,163,74,0.35)"
                        : "0 8px 32px rgba(220,38,38,0.35)",
                    }}
                  >
                    {isLoading && !isSuccess && (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    {isSuccess && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    <span>
                      {isSuccess
                        ? "Redirecting…"
                        : isLoading
                        ? "Please wait…"
                        : isSignIn
                        ? "Sign In"
                        : "Create Account"}
                    </span>
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Feature pills */}
          {mode !== "forgot" && (
            <div className="flex items-center justify-center gap-4 mt-6 flex-wrap">
              {["AI Search", "10K+ Titles", "HD Trailers"].map((f) => (
                <span key={f} className="flex items-center gap-1.5 text-[11px] text-gray-500">
                  <span className="w-1 h-1 rounded-full bg-red-500/70 inline-block" />
                  {f}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
