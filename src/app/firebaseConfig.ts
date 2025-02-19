import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBy0XKX6t_ebUIWXAIbEkhVeDTk7jDLw-E",
  authDomain: "kanun-ka-kura-2e0f2.firebaseapp.com",
  projectId: "kanun-ka-kura-2e0f2",
  storageBucket: "kanun-ka-kura-2e0f2.appspot.com", 
  messagingSenderId: "2325491057",
  appId: "1:2325491057:web:2198c6061e1b66cadcdad0",
  measurementId: "G-LN1D4PYYPW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize Authentication
const db = getFirestore(app); // Initialize Firestore

export { auth, db }; // Export both auth and db
 