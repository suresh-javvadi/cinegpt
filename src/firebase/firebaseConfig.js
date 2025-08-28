// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBncd_8pT2KZOyQf7dy4osUzH7KuSW2l5Q",
  authDomain: "cinegpt-7104.firebaseapp.com",
  projectId: "cinegpt-7104",
  storageBucket: "cinegpt-7104.firebasestorage.app",
  messagingSenderId: "583227513729",
  appId: "1:583227513729:web:24537abe09384d024be680",
  measurementId: "G-2HC1SJ617E",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth();
