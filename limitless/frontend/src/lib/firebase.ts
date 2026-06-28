import { env } from "@/config/env";

let _auth: import("firebase/auth").Auth | null = null;
let _googleProvider: import("firebase/auth").GoogleAuthProvider | null = null;

function ensureFirebase() {
  if (typeof window === "undefined") {
    throw new Error("Firebase must only be used client-side");
  }
  if (_auth && _googleProvider) return { auth: _auth, googleProvider: _googleProvider };

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { initializeApp, getApps, getApp } = require("firebase/app") as typeof import("firebase/app");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getAuth, GoogleAuthProvider } = require("firebase/auth") as typeof import("firebase/auth");

  const firebaseConfig = {
    apiKey: env.firebase.apiKey,
    authDomain: env.firebase.authDomain,
    projectId: env.firebase.projectId,
    appId: env.firebase.appId,
  };

  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  _auth = getAuth(app) as import("firebase/auth").Auth;
  _googleProvider = new GoogleAuthProvider();

  return { auth: _auth, googleProvider: _googleProvider };
}

export function getFirebaseAuth(): import("firebase/auth").Auth {
  return ensureFirebase().auth;
}

export function getGoogleProvider(): import("firebase/auth").GoogleAuthProvider {
  return ensureFirebase().googleProvider!;
}
