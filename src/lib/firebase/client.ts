import { getApps, getApp, deleteApp, initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
} from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFunctions } from 'firebase/functions';

if (
  !import.meta.env.VITE_APIKEY ||
  !import.meta.env.VITE_APP_ID ||
  !import.meta.env.VITE_AUTH_DOMAIN ||
  !import.meta.env.VITE_MEASUREMENT_ID ||
  !import.meta.env.VITE_MESSAGING_SENDER_ID ||
  !import.meta.env.VITE_PROJECT_ID ||
  !import.meta.env.VITE_STORAGE_BUCKET
) {
  throw new Error('Firebase client environment variables not set!')
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  appId: import.meta.env.VITE_APP_ID,  // Needed for analytics
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID, // Needed for analytics
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
};

let firebaseApp;
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
  deleteApp(firebaseApp);
  firebaseApp = initializeApp(firebaseConfig);
}

// Initialize Firebase
export const app = firebaseApp;
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);

export const storage = getStorage(firebaseApp);

export const functions = getFunctions(firebaseApp);

export const getClientApp: () => FirebaseApp = () => {
  if (getApps().length) {
    return getApp()
  }
  const clientApp = initializeApp(firebaseConfig)

  return clientApp
}






