import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDY_BF_Cw4jVJ1YZgrCPJylVoD-xKRPvXY",
  authDomain: "hr-odoo-ddd6e.firebaseapp.com",
  projectId: "hr-odoo-ddd6e",
  storageBucket: "hr-odoo-ddd6e.firebasestorage.app",
  messagingSenderId: "620655993698",
  appId: "1:620655993698:web:bbc183ebdbb6d0bd26423b",
  measurementId: "G-0J6ZYGXFCJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
