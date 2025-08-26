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

  if (!passwordRegex.test(password)) {
    errors.passwordErr = [
      "Password must be at least 8 characters",
      "an uppercase letter, a lowercase letter",
      "a number, and a special character.",
    ];
  }

  if (!fullNameRegex.test(fullName)) {
    errors.fullNameErr = "Full name must be at least 2 characters";
  }

  if (errors.emailErr || errors.passwordErr || errors.fullNameErr) {
    return errors;
  } else {
    return null;
  }
};
