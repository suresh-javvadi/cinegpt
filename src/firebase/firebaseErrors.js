export const getFirebaseErrorMessage = (code) => {
  const errorMessages = {
    // Login errors
    "auth/invalid-email":
      "Sorry, the email address you entered is not valid. Please check and try again.",
    "auth/user-disabled":
      "Sorry, this account has been disabled. Please contact support if you need assistance.",
    "auth/user-not-found":
      "Sorry, we can't find an account with this email address. Please try again or create a new account.",
    "auth/wrong-password":
      "Sorry, the password you entered is incorrect. Please try again or reset your password.",
    "auth/invalid-credential":
      "Sorry, the email and password do not match. Please check your details and try again.",

    // Signup errors
    "auth/email-already-in-use":
      "Sorry, this email is already registered. Please sign in instead.",
    "auth/weak-password":
      "Sorry, your password is too weak. Please choose at least 6 characters for better security.",

    // Default fallback
    default: "Sorry, something went wrong. Please try again later.",
  };

  return errorMessages[code] || errorMessages.default;
};
