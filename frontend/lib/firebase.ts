import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCochXi_YVVcwlCRYXa7aSm2FQIKUoUfYw",
  authDomain: "zeeprinter0.firebaseapp.com",
  projectId: "zeeprinter0",
  storageBucket: "zeeprinter0.firebasestorage.app",
  messagingSenderId: "1020850146879",
  appId: "1:1020850146879:web:8386f65a4652ce08a6f28a",
  measurementId: "G-0HRJ1LN4HB"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export { app, auth };
