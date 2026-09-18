import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDGgTDrDJsRvulhzK1p59AbuhJwQYSUufI",
  authDomain: "mindinbox-50d84.firebaseapp.com",
  projectId: "mindinbox-50d84",
  storageBucket: "mindinbox-50d84.firebasestorage.app",
  messagingSenderId: "1087016266441",
  appId: "1:1087016266441:web:6d5242057c39e744ee3b18",
  measurementId: "G-KDFGGPKSB2"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;

