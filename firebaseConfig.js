import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Firebase configuration
// Replace the following with your Firebase project's configuration
const firebaseConfig = {
  apiKey: "AIzaSyDWPmJT6QwDzSKrA86YJhhh2hwVAMgCb-I",
  authDomain: "doctor-f3115.firebaseapp.com",
  databaseURL: "https://doctor-f3115-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "doctor-f3115",
  storageBucket: "doctor-f3115.firebasestorage.app",
  messagingSenderId: "1020363900244",
  appId: "1:1020363900244:web:fd9dc6079e5dff245a34c1",
  measurementId: "G-VYT366SKZ7"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app);

// Initialize Firebase
 

 const db = getDatabase(app, "https://doctor-f3115-default-rtdb.asia-southeast1.firebasedatabase.app");

export { auth, db };
