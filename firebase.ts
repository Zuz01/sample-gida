// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAkajDD2sNu5sxg5NyLVqOJ1XuX_v99NsE",
  authDomain: "gidana-a0e86.firebaseapp.com",
  projectId: "gidana-a0e86",
  storageBucket: "gidana-a0e86.firebasestorage.app",
  messagingSenderId: "61142895252",
  appId: "1:61142895252:web:56630aa2b6c8e65f0a8281",
  measurementId: "G-YTF50TMB0H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);