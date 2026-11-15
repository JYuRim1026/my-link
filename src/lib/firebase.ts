import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyARqdVGq4BYqJPQdAAqCw1JnaCAlQtGo5c",
  authDomain: "mylink-project-7b4c8.firebaseapp.com",
  projectId: "mylink-project-7b4c8",
  storageBucket: "mylink-project-7b4c8.firebasestorage.app",
  messagingSenderId: "690173923357",
  appId: "1:690173923357:web:25cd41bb29447f7040b6f4",
  measurementId: "G-V38G3YEK26",
};

const cleanEnv = (val: string | undefined, fallback: string): string => {
  if (!val) return fallback;
  const cleaned = val.trim().replace(/^["']|["']$/g, "").trim();
  return cleaned || fallback;
};

const rawApiKey = cleanEnv(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  DEFAULT_FIREBASE_CONFIG.apiKey
);

// Strictly validate Google Firebase Web API key format (no colons, spaces, or invalid chars)
const isValidFirebaseApiKey = /^AIza[0-9A-Za-z_-]{30,50}$/.test(rawApiKey);

const firebaseConfig = {
  apiKey: isValidFirebaseApiKey ? rawApiKey : DEFAULT_FIREBASE_CONFIG.apiKey,
  authDomain: cleanEnv(
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    DEFAULT_FIREBASE_CONFIG.authDomain
  ),
  projectId: cleanEnv(
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    DEFAULT_FIREBASE_CONFIG.projectId
  ),
  storageBucket: cleanEnv(
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    DEFAULT_FIREBASE_CONFIG.storageBucket
  ),
  messagingSenderId: cleanEnv(
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    DEFAULT_FIREBASE_CONFIG.messagingSenderId
  ),
  appId: cleanEnv(
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    DEFAULT_FIREBASE_CONFIG.appId
  ),
  measurementId: cleanEnv(
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    DEFAULT_FIREBASE_CONFIG.measurementId
  ),
};

// Initialize Firebase safely (with fallback recovery if default app had invalid options)
let app: FirebaseApp;
let auth: Auth;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
} catch {
  app = initializeApp(DEFAULT_FIREBASE_CONFIG, "mylink-safe-app");
  auth = getAuth(app);
}

const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});
const storage = getStorage(app);

// Initialize Analytics safely (Browser-only, SSR-safe)
const initAnalytics = async () => {
  if (typeof window !== "undefined") {
    const supported = await isSupported();
    if (supported) {
      return getAnalytics(app);
    }
  }
  return null;
};

export { app, db, auth, googleProvider, storage, initAnalytics };
