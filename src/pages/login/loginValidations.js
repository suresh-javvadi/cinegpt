export const loginValidation = (email, password, fullName) => {
  const emailRegex = /^\S+@\S+\.\S+$/;
  const passwordRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
  const fullNameRegex = /^[A-Za-z\s]{2,}$/;

  let errors = {
    emailErr: null,
    passwordErr: null,
    fullNameErr: null,
  };
  if (!emailRegex.test(email)) {
    errors.emailErr = "Please enter a valid email address";
  }

  const passwordErrors = [];

  if (password === null || password === "") {
    passwordErrors.push("Oops! You forgot to enter your password.");
  } else if (!passwordRegex.test(password)) {
    passwordErrors.push(
      "Password must be at least 8 characters,",
      "include an uppercase letter, a lowercase letter,",
      "a number, and a special character."
    );
  }

  errors.passwordErr = passwordErrors.length === 0 ? null : passwordErrors;

  if (!fullNameRegex.test(fullName)) {
    errors.fullNameErr = "Full name must be at least 2 characters";
  }

  return errors;
};
