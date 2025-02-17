import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBy0XKX6t_ebUIWXAIbEkhVeDTk7jDLw-E",
  authDomain: "kanun-ka-kura-2e0f2.firebaseapp.com",
  projectId: "kanun-ka-kura-2e0f2",
  storageBucket: "kanun-ka-kura-2e0f2.firebasestorage.app",
  messagingSenderId: "2325491057",
  appId: "1:2325491057:web:2198c6061e1b66cadcdad0",
  measurementId: "G-LN1D4PYYPW"
};

// Initialize Firebase
let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Initialize Analytics only on client side
let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then(yes => yes && (analytics = getAnalytics(app)));
}

export { app, auth, db, analytics, googleProvider };
