import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDGgTDrDJsRvulhzK1p59AbuhJwQYSUufI",
  authDomain: "mindinbox-50d84.firebaseapp.com",
  projectId: "mindinbox-50d84",
  storageBucket: "mindinbox-50d84.firebasestorage.app",
  messagingSenderId: "1087016266441",
  appId: "1:1087016266441:web:6d5242057c39e744ee3b18",
  measurementId: "G-KDFGGPKSB2"
};

// Initialize variables
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

// Strictly client-side initialization to prevent SSR hydration mismatches
if (typeof window !== 'undefined') {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error("Firebase Initialization Error:", error);
  }
}

export { app, auth, db };
