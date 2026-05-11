/**
 * auth-utils.ts
 * Pure Firebase Auth utility functions — no NextAuth.
 *
 * Google sign-in:
 *   - Development (localhost): signInWithPopup  (avoids cross-origin storage issues)
 *   - Production (Vercel):     signInWithRedirect (better for mobile/Safari)
 */

import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  UserCredential,
  AuthError,
  User,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getFirebaseAuth, getFirebaseDb, getGoogleProvider } from "./firebase-config";
import type { UserDoc } from "./types";

const DIU_EMAIL_DOMAIN = "diu.edu.bd";
const SUPER_ADMIN_EMAIL = "admin@admin.com";

// ─── User Document Helpers ────────────────────────────────────────────────────

export function buildUserDoc(user: {
  uid: string;
  name: string;
  email: string;
  role: "student" | "super-admin";
  photoURL?: string | null;
}): UserDoc {
  return {
    uid: user.uid,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: new Date().toISOString(),
    ...(user.photoURL ? { photoURL: user.photoURL } : {}),
  };
}

/**
 * Fetch existing UserDoc from Firestore, or create one if missing.
 */
export async function getOrCreateUserDoc(
  uid: string,
  fallback: Omit<UserDoc, "uid" | "createdAt">
): Promise<UserDoc> {
  const db = getFirebaseDb();
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);

  if (snapshot.exists()) {
    return snapshot.data() as UserDoc;
  }

  const newDoc = buildUserDoc({ uid, ...fallback });
  await setDoc(userRef, newDoc);
  return newDoc;
}

// ─── Google Sign-In ───────────────────────────────────────────────────────────

/**
 * Sign in with Google.
 * - Dev:  popup  → returns UserDoc immediately
 * - Prod: redirect → returns null, page reloads, call handleGoogleRedirectResult()
 */
export async function initiateGoogleSignIn(): Promise<UserDoc | null> {
  const auth = getFirebaseAuth();
  const provider = getGoogleProvider();
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    // ── Popup (development) ──────────────────────────────────────────────────
    let result: UserCredential;
    try {
      result = await signInWithPopup(auth, provider);
    } catch (err) {
      const error = err as AuthError;
      if (error.code === "auth/popup-closed-by-user" || error.code === "auth/cancelled-popup-request") {
        throw new Error("Sign-in cancelled. Please try again.");
      }
      throw new Error(error.message || "Google sign-in failed.");
    }

    const firebaseUser = result.user;

    if (!firebaseUser.email?.endsWith(`@${DIU_EMAIL_DOMAIN}`)) {
      await firebaseSignOut(auth);
      throw new Error("Only @diu.edu.bd email accounts are allowed.");
    }

    return getOrCreateUserDoc(firebaseUser.uid, {
      name: firebaseUser.displayName || "",
      email: firebaseUser.email,
      role: "student",
      photoURL: firebaseUser.photoURL || undefined,
    });
  } else {
    // ── Redirect (production) ────────────────────────────────────────────────
    await signInWithRedirect(auth, provider);
    return null; // page navigates away
  }
}

/**
 * Call on every page load in production to capture the Google redirect result.
 * Returns UserDoc if a redirect just completed, null on normal loads.
 */
export async function handleGoogleRedirectResult(): Promise<UserDoc | null> {
  const auth = getFirebaseAuth();
  let result: UserCredential | null = null;

  try {
    result = await getRedirectResult(auth);
  } catch (err) {
    const error = err as AuthError;
    if (error.code === "auth/unauthorized-domain") {
      throw new Error("This domain is not authorized in Firebase Console → Authentication → Authorized domains.");
    }
    throw new Error(error.message || "Google sign-in failed. Please try again.");
  }

  if (!result) return null;

  const firebaseUser = result.user;

  if (!firebaseUser.email?.endsWith(`@${DIU_EMAIL_DOMAIN}`)) {
    await firebaseSignOut(auth);
    throw new Error("Only @diu.edu.bd email accounts are allowed.");
  }

  return getOrCreateUserDoc(firebaseUser.uid, {
    name: firebaseUser.displayName || "",
    email: firebaseUser.email,
    role: "student",
    photoURL: firebaseUser.photoURL || undefined,
  });
}

// ─── Email / Password Sign-In (Admin) ────────────────────────────────────────

export async function signInWithEmailPassword(
  email: string,
  password: string
): Promise<UserDoc> {
  const auth = getFirebaseAuth();
  const normalizedEmail = email.toLowerCase().trim();
  const isSuperAdmin = normalizedEmail === SUPER_ADMIN_EMAIL;
  const isDiuEmail = normalizedEmail.endsWith(`@${DIU_EMAIL_DOMAIN}`);

  if (!isSuperAdmin && !isDiuEmail) {
    throw new Error("Only DIU email accounts or the super admin account are allowed.");
  }

  let credential: UserCredential;

  try {
    credential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
  } catch (err) {
    const error = err as AuthError;
    if (isSuperAdmin && (error.code === "auth/invalid-credential" || error.code === "auth/user-not-found")) {
      credential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
    } else {
      throw new Error(error.message || "Sign-in failed. Check your credentials.");
    }
  }

  const firebaseUser = credential.user;

  return getOrCreateUserDoc(firebaseUser.uid, {
    name: isSuperAdmin ? "Super Admin" : firebaseUser.displayName || "",
    email: firebaseUser.email || normalizedEmail,
    role: isSuperAdmin ? "super-admin" : "student",
    photoURL: firebaseUser.photoURL || undefined,
  });
}

// ─── Sign Out ─────────────────────────────────────────────────────────────────

export async function signOutUser(): Promise<void> {
  await firebaseSignOut(getFirebaseAuth());
}

// ─── Auth State Listener ──────────────────────────────────────────────────────

/**
 * Subscribe to Firebase auth state changes.
 * Returns the unsubscribe function.
 */
export function subscribeToAuthState(
  callback: (user: User | null) => void
): () => void {
  return onAuthStateChanged(getFirebaseAuth(), callback);
}
