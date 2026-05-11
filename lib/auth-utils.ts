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
 * On every login, merges fresh session data (name, photoURL) without
 * overwriting profile fields the user has set (studentId, department, etc.)
 */
export async function getOrCreateUserDoc(
  uid: string,
  fallback: Omit<UserDoc, "uid" | "createdAt">
): Promise<UserDoc> {
  const db = getFirebaseDb();
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);

  if (snapshot.exists()) {
    const existing = snapshot.data() as UserDoc;
    // Merge only non-profile fields from the session (name, photoURL)
    // so we don't overwrite studentId, department, batch, etc.
    const updates: Partial<UserDoc> = {};
    if (fallback.name && fallback.name !== existing.name && !existing.studentId) {
      // Only update name if user hasn't set their own name via profile
      updates.name = fallback.name;
    }
    if (fallback.photoURL && fallback.photoURL !== existing.photoURL) {
      updates.photoURL = fallback.photoURL;
    }
    if (Object.keys(updates).length > 0) {
      await setDoc(userRef, { ...existing, ...updates }, { merge: true });
      return { ...existing, ...updates };
    }
    return existing;
  }

  // First login — create the document
  const newDoc = buildUserDoc({ uid, ...fallback });
  await setDoc(userRef, newDoc);
  return newDoc;
}

export function resolveRole(email?: string | null): "student" | "super-admin" {
  return email?.toLowerCase() === SUPER_ADMIN_EMAIL ? "super-admin" : "student";
}
