export const validateSignIn = (email, password) => {
  const emailRegex = /^\S+@\S+\.\S+$/;

  return {
    emailErr: !email
      ? "🎬 Plot hole detected! You forgot your email"
      : !emailRegex.test(email)
      ? "🎞️ Cut! That email looks faker than CGI hair"
      : null,

    passwordErr: !password
      ? ["🍿 Missing password? Bold choice for a thriller"]
      : null,
  };
};

export const validateSignUp = (email, password, fullName) => {
  const emailRegex = /^\S+@\S+\.\S+$/;
  const passwordRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
  const fullNameRegex = /^[A-Za-z\s]{2,}$/;

  let errors = {
    emailErr: null,
    passwordErr: null,
    fullNameErr: null,
  };

  errors.emailErr = !email
    ? "🎬 Scene missing! Drop your email on the script"
    : !emailRegex.test(email)
    ? "🎞️ That email needs a reshoot… use the correct format"
    : null;

  const passwordErrors = [];

  if (!password) {
    passwordErrors.push("🍿 Plot twist! You forgot your password again");
  } else if (!passwordRegex.test(password)) {
    passwordErrors.push(
      "🎥 Weak password alert! Even the extras could guess this",
      "🎭 Add 8+ characters, uppercase, lowercase,",
      "🔢 a number & special symbol. Make it Oscar-worthy!"
    );
  }

  errors.passwordErr = passwordErrors.length === 0 ? null : passwordErrors;

  // Full Name
  errors.fullNameErr = !fullName
    ? "🎭 Character name missing! Who's starring in this movie?"
    : !fullNameRegex.test(fullName)
    ? "🎬 That name is shorter than a TikTok skit"
    : null;

  return errors;
};
