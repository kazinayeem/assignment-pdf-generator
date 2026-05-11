/**
 * auth-utils.ts
 * Reusable Firebase Auth utility functions.
 *
 * All Firebase instances are accessed via lazy getters (getFirebaseAuth etc.)
 * so this module is safe to import in any file — Firebase only initializes
 * when these functions are actually called in the browser.
 */

import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  UserCredential,
  AuthError,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getFirebaseAuth, getFirebaseDb, getGoogleProvider } from "./firebase-config";
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

// ─── Google Sign-In (Popup) ───────────────────────────────────────────────────

/**
 * Initiates Google sign-in using popup flow.
 * Returns the normalized UserDoc when sign-in succeeds.
 */
export async function initiateGoogleSignIn(): Promise<UserDoc | null> {
  const auth = getFirebaseAuth();
  const provider = getGoogleProvider();

  console.log("🔍 [AUTH-UTILS] Initiating Google sign-in (popup flow)...");
  console.log("🔍 [AUTH-UTILS] Current URL:", window.location.href);

  let credential: UserCredential;

  try {
    credential = await signInWithPopup(auth, provider);
  } catch (err) {
    const error = err as AuthError;
    console.error("❌ [AUTH-UTILS] Popup sign-in error:", error.code, error.message);

    if (error.code === "auth/popup-closed-by-user") {
      throw new Error("Google sign-in was canceled.");
    }
    if (error.code === "auth/popup-blocked") {
      throw new Error("Popup was blocked by the browser. Please allow popups and try again.");
    }
    if (error.code === "auth/account-exists-with-different-credential") {
      throw new Error("An account already exists with a different sign-in method.");
    }

    throw error;
  }
  const firebaseUser = credential.user;
  console.log("🔍 [AUTH-UTILS] Firebase user from popup:", {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
  });

  // Enforce DIU email domain
  if (!firebaseUser.email?.endsWith(`@${DIU_EMAIL_DOMAIN}`)) {
    console.log("❌ [AUTH-UTILS] Email domain check failed:", firebaseUser.email);
    await firebaseSignOut(auth);
    throw new Error("Only @diu.edu.bd email accounts are allowed.");
  }

  console.log("🔍 [AUTH-UTILS] Creating/fetching user doc...");
  const userDoc = await getOrCreateUserDoc(firebaseUser.uid, {
    name: firebaseUser.displayName || "",
    email: firebaseUser.email || "",
    role: "student",
    photoURL: firebaseUser.photoURL,
  });
  console.log("✅ [AUTH-UTILS] User doc ready:", userDoc);
  return userDoc;
}

// ─── Email / Password Sign-In (Admin) ────────────────────────────────────────

/**
 * Sign in with email + password.
 * Auto-creates the super-admin account on first use.
 */
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
    // Auto-create super-admin on first run
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

  return getOrCreateUserDoc(firebaseUser.uid, {
    name: isSuperAdmin ? "Super Admin" : firebaseUser.displayName || "",
    email: firebaseUser.email || normalizedEmail,
    role: isSuperAdmin ? "super-admin" : "student",
    photoURL: firebaseUser.photoURL,
  });
}

// ─── Sign Out ─────────────────────────────────────────────────────────────────

export async function signOutUser(): Promise<void> {
  await firebaseSignOut(getFirebaseAuth());
}
