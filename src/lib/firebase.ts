import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const cleanEnv = (val: string | undefined, fallback: string): string => {
  const cleaned = (val || "").trim().replace(/^["']|["']$/g, "");
  return cleaned || fallback;
};

const rawApiKey = cleanEnv(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  "AIzaSyARqdVGq4BYqJPQdAAqCw1JnaCAlQtGo5c"
);

// Valid Firebase Web API keys always start with "AIza"
const safeApiKey = rawApiKey.startsWith("AIza")
  ? rawApiKey
  : "AIzaSyARqdVGq4BYqJPQdAAqCw1JnaCAlQtGo5c";

const firebaseConfig = {
  apiKey: safeApiKey,
  authDomain: cleanEnv(
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    "mylink-project-7b4c8.firebaseapp.com"
  ),
  projectId: cleanEnv(
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    "mylink-project-7b4c8"
  ),
  storageBucket: cleanEnv(
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    "mylink-project-7b4c8.firebasestorage.app"
  ),
  messagingSenderId: cleanEnv(
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    "690173923357"
  ),
  appId: cleanEnv(
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    "1:690173923357:web:25cd41bb29447f7040b6f4"
  ),
  measurementId: cleanEnv(
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    "G-V38G3YEK26"
  ),
};

// Initialize Firebase (Singleton pattern for Next.js SSR & HMR)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize core Firebase services
const db = getFirestore(app);
const auth = getAuth(app);
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
