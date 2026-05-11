/**
 * firebase-config.ts
 *
 * Firebase is a browser-only SDK. During Next.js static prerendering on Vercel,
 * this module is evaluated server-side where NEXT_PUBLIC_ env vars are undefined.
 *
 * Solution: lazy initialization via getFirebaseAuth() / getFirebaseDb() /
 * getGoogleProvider() — these are only called inside "use client" code at
 * runtime in the browser, never during server-side prerendering.
 *
 * DO NOT call initializeApp() at module top-level — that runs during prerender
 * and causes auth/invalid-api-key because env vars are undefined server-side.
 */

import { FirebaseApp, getApps, initializeApp, getApp } from "firebase/app";
import {
  Auth,
  getAuth,
  GoogleAuthProvider,
  initializeAuth,
  browserPopupRedirectResolver,
  indexedDBLocalPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";

// Cached singleton instances
let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _googleProvider: GoogleAuthProvider | null = null;

/** Initialize (or return cached) Firebase app. Only call from browser context. */
function getFirebaseApp(): FirebaseApp {
  if (_app) return _app;

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) {
    throw new Error(
      "[CoverGen] Firebase env vars are not set. " +
        "Add NEXT_PUBLIC_FIREBASE_* variables in Vercel → Project → Settings → Environment Variables and redeploy."
    );
  }

  _app = getApps().length
    ? getApp()
    : initializeApp({
        apiKey,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      });

  return _app;
}

/** Lazy Firebase Auth — safe to import anywhere, only initializes in browser */
export function getFirebaseAuth(): Auth {
  if (!_auth) {
    const app = getFirebaseApp();

    try {
      // Explicit auth initialization improves redirect reliability across browsers.
      _auth = initializeAuth(app, {
        persistence: [indexedDBLocalPersistence, browserLocalPersistence],
        popupRedirectResolver: browserPopupRedirectResolver,
      });
    } catch {
      // If Auth is already initialized elsewhere, fall back to the existing instance.
      _auth = getAuth(app);
    }
  }

  return _auth;
}

/** Lazy Firestore — safe to import anywhere, only initializes in browser */
export function getFirebaseDb(): Firestore {
  if (!_db) _db = getFirestore(getFirebaseApp());
  return _db;
}

/** Lazy Google provider — configured for redirect flow */
export function getGoogleProvider(): GoogleAuthProvider {
  if (!_googleProvider) {
    _googleProvider = new GoogleAuthProvider();
    _googleProvider.addScope("profile");
    _googleProvider.addScope("email");
    // Force account chooser every time — required for redirect-based sign-in
    _googleProvider.setCustomParameters({ prompt: "select_account" });
  }
  return _googleProvider;
}
