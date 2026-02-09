// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD0nCwLjVYtWo3puNnk14svXouLXzauX70",
  authDomain: "cinegpt-9959.firebaseapp.com",
  projectId: "cinegpt-9959",
  storageBucket: "cinegpt-9959.firebasestorage.app",
  messagingSenderId: "735324690486",
  appId: "1:735324690486:web:832bb63043f302c4cbe097",
  measurementId: "G-Z8GX6H5GF7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth();
