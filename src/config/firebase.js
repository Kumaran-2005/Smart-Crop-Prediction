import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app = null;
let auth = null;
let db = null;

try {
  // Basic sanity: ensure required keys exist to avoid runtime crashes on Pages
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.appId) {
    throw new Error('Missing Firebase env. Set VITE_FIREBASE_* variables.');
  }
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (e) {
  // Don’t crash the whole app; log and allow UI to render logged-out experience
  console.error('Firebase initialization failed:', e);
}

export { app };
export { auth };
export { db };
export const firebaseReady = !!app;
export default app;
