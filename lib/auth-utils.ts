/**
 * auth-utils.ts
 *
 * Auth is handled by NextAuth (Google OAuth + JWT sessions).
 * Firebase is used ONLY for Firestore data storage — no Firebase Auth.
 */

import { doc, getDoc, setDoc } from "firebase/firestore";
import { getFirebaseDb } from "./firebase-config";
import type { UserDoc } from "./types";

const SUPER_ADMIN_EMAIL = "admin@admin.com";

// ─── User Document Helpers ────────────────────────────────────────────────────

export function buildUserDoc(user: {
  uid: string;
  name: string;
  email: string;
  role: "student" | "super-admin";
  photoURL?: string;
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
 * Called after NextAuth session is established.
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

export function resolveRole(email?: string | null): "student" | "super-admin" {
  return email?.toLowerCase() === SUPER_ADMIN_EMAIL ? "super-admin" : "student";
}
