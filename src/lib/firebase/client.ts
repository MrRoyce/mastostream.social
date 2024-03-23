import { getApps, getApp, deleteApp, initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink
} from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFunctions } from 'firebase/functions';
// import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

if (
  !import.meta.env.VITE_APIKEY ||
  !import.meta.env.VITE_APP_ID ||
  !import.meta.env.VITE_AUTH_DOMAIN ||
  //  !import.meta.env.VITE_DATABASE_URL ||
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
  // databaseURL: import.meta.env.VITE_DATABASE_URL,
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

// Initialize AppCheck
// const appCheck = initializeAppCheck(firebaseApp, {
//   provider: new ReCaptchaV3Provider('6LcQUKIpAAAAAGVIaHTTcaD8Q2rLGEL_87QPDrZR'),

//   // Optional argument. If true, the SDK automatically refreshes App Check
//   // tokens as needed.
//   isTokenAutoRefreshEnabled: true
// });

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

export const isMagicLink = (link: string) => {
  const auth = getAuth(getClientApp())

  return isSignInWithEmailLink(auth, link)
}

export const signInWithMagicLink = (email: string, link: string) => {
  const auth = getAuth(getClientApp())

  return signInWithEmailLink(auth, email, link)
}

export const sendMagicLink = (email: string, redirectUrl: string) => {
  const auth = getAuth(getClientApp())
  const actionCodeSettings = {
    url: redirectUrl,
    handleCodeInApp: true,
  }

  return sendSignInLinkToEmail(auth, email, actionCodeSettings)
}
