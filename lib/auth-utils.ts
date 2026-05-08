/**
 * auth-utils.ts
 * Reusable Firebase Auth utility functions.
 * All Google sign-in uses redirect (not popup) for production compatibility
 * — avoids auth/popup-blocked on Safari, mobile browsers, and Vercel deployments.
 */

import {
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  UserCredential,
  AuthError,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "./firebase-config";
import type { UserDoc } from "./types";

const DIU_EMAIL_DOMAIN = "diu.edu.bd";
const SUPER_ADMIN_EMAIL = "admin@admin.com";

// ─── User Document Helpers ────────────────────────────────────────────────────

/** Build a Firestore UserDoc from a Firebase user object */
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
 * Fetch an existing UserDoc from Firestore, or create one if it doesn't exist.
 * Returns the UserDoc and whether it was newly created.
 */
export async function getOrCreateUserDoc(
  uid: string,
  fallback: Omit<UserDoc, "uid" | "createdAt">
): Promise<UserDoc> {
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);

  if (snapshot.exists()) {
    return snapshot.data() as UserDoc;
  }

  const newDoc = buildUserDoc({ uid, ...fallback });
  await setDoc(userRef, newDoc);
  return newDoc;
}

// ─── Google Sign-In (Redirect) ────────────────────────────────────────────────

/**
 * Initiates Google sign-in via redirect.
 * The page will navigate away — call handleGoogleRedirectResult() on return.
 * Using redirect instead of popup:
 *   ✓ Works on Safari / iOS (popups blocked by default)
 *   ✓ Works on mobile browsers
 *   ✓ No popup-blocked errors on Vercel / production
 */
export async function initiateGoogleSignIn(): Promise<void> {
  await signInWithRedirect(auth, googleProvider);
  // Execution stops here — browser navigates to Google
}

/**
 * Call this on every page load (inside AuthInitializer) to capture the
 * redirect result after Google returns the user to the app.
 *
 * Returns the UserDoc if a redirect just completed, or null if no redirect pending.
 * Throws with a user-friendly message on domain/permission errors.
 */
export async function handleGoogleRedirectResult(): Promise<UserDoc | null> {
  let result: UserCredential | null = null;

  try {
    // getRedirectResult resolves immediately with null if no redirect is pending
    result = await getRedirectResult(auth);
  } catch (err) {
    const error = err as AuthError;
    console.error("Redirect result error:", error.code, error.message);

    // Surface meaningful errors to the UI
    if (error.code === "auth/unauthorized-domain") {
      throw new Error(
        "This domain is not authorized in Firebase. Add it under Authentication → Settings → Authorized domains."
      );
    }
    if (error.code === "auth/account-exists-with-different-credential") {
      throw new Error("An account already exists with a different sign-in method.");
    }
    throw new Error(error.message || "Google sign-in failed. Please try again.");
  }

  // No redirect was pending — normal page load
  if (!result) return null;

  const firebaseUser = result.user;

  // Enforce DIU email domain
  if (!firebaseUser.email?.endsWith(`@${DIU_EMAIL_DOMAIN}`)) {
    await firebaseSignOut(auth);
    throw new Error("Only @diu.edu.bd email accounts are allowed.");
  }

  // Fetch or create Firestore user document
  const userData = await getOrCreateUserDoc(firebaseUser.uid, {
    name: firebaseUser.displayName || "",
    email: firebaseUser.email || "",
    role: "student",
    photoURL: firebaseUser.photoURL,
  });

  return userData;
}

// ─── Email / Password Sign-In (Admin) ────────────────────────────────────────

/**
 * Sign in with email + password.
 * For the super-admin account: auto-creates the account if it doesn't exist yet.
 */
export async function signInWithEmailPassword(
  email: string,
  password: string
): Promise<UserDoc> {
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

    // Auto-create super-admin account on first run
    if (
      isSuperAdmin &&
      (error.code === "auth/invalid-credential" || error.code === "auth/user-not-found")
    ) {
      credential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
    } else {
      throw new Error(error.message || "Sign-in failed. Check your credentials.");
    }
  }

  const firebaseUser = credential.user;

  const userData = await getOrCreateUserDoc(firebaseUser.uid, {
    name: isSuperAdmin ? "Super Admin" : firebaseUser.displayName || "",
    email: firebaseUser.email || normalizedEmail,
    role: isSuperAdmin ? "super-admin" : "student",
    photoURL: firebaseUser.photoURL,
  });

  return userData;
}

// ─── Sign Out ─────────────────────────────────────────────────────────────────

export async function signOutUser(): Promise<void> {
  await firebaseSignOut(auth);
}
