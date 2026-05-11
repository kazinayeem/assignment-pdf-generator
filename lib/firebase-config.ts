/**
 * firebase-config.ts
 *
 * Firebase is used ONLY for Firestore data storage.
 * Authentication is handled by NextAuth — no Firebase Auth here.
 *
 * Lazy initialization prevents server-side prerender errors on Vercel
 * where NEXT_PUBLIC_ env vars are undefined during static generation.
 */

import { FirebaseApp, getApps, initializeApp, getApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";

let _app: FirebaseApp | null = null;
let _db: Firestore | null = null;

function getFirebaseApp(): FirebaseApp {
  if (_app) return _app;

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) {
    throw new Error(
      "[CoverGen] Firebase env vars are not set. " +
        "Add NEXT_PUBLIC_FIREBASE_* variables in Vercel → Settings → Environment Variables."
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

/** Lazy Firestore — only initializes in browser, safe to import anywhere */
export function getFirebaseDb(): Firestore {
  if (!_db) _db = getFirestore(getFirebaseApp());
  return _db;
}
