"use client";

/**
 * auth-store.ts
 * Zustand store for Firebase authentication state — no NextAuth.
 */

import { create } from "zustand";
import { doc, getDoc } from "firebase/firestore";
import { getFirebaseDb } from "./firebase-config";
import {
  initiateGoogleSignIn,
  handleGoogleRedirectResult,
  signInWithEmailPassword,
  signOutUser,
  subscribeToAuthState,
  getOrCreateUserDoc,
} from "./auth-utils";
import type { UserDoc, AuthContextType } from "./types";

// ─── Store Interface ──────────────────────────────────────────────────────────

interface AuthStore extends AuthContextType {
  initializeAuth: () => () => void;
  handleRedirectResult: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  signInWithEmailPassword: (email: string, password: string) => Promise<void>;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function applyUser(userData: UserDoc) {
  return {
    user: userData,
    isAuthenticated: true,
    isSuperAdmin: userData.role === "super-admin",
    isStudent: userData.role === "student",
    loading: false,
    error: null,
  };
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false,
  isSuperAdmin: false,
  isStudent: false,

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // ── Google Sign-In ──────────────────────────────────────────────────────────
  // Dev:  popup  → userData returned immediately → apply to store
  // Prod: redirect → null returned → page navigates away → handleRedirectResult on return
  signInWithGoogle: async () => {
    try {
      set({ loading: true, error: null });
      const userData = await initiateGoogleSignIn();
      if (userData) {
        // Popup flow (dev) — result is immediate
        set(applyUser(userData));
      }
      // Redirect flow (prod) — page navigates away, nothing to do here
    } catch (error: any) {
      set({ error: error.message || "Google sign-in failed.", loading: false });
    }
  },

  // ── Redirect Result (production only) ──────────────────────────────────────
  // Called by AuthInitializer BEFORE onAuthStateChanged so protected routes
  // don't see a false unauthenticated state while the redirect is processing.
  handleRedirectResult: async () => {
    if (process.env.NODE_ENV === "development") return;

    try {
      const userData = await handleGoogleRedirectResult();
      if (userData) {
        set(applyUser(userData));
      }
    } catch (error: any) {
      set({ error: error.message || "Google sign-in failed.", loading: false });
    }
  },

  // ── Email / Password ────────────────────────────────────────────────────────
  signInWithEmailPassword: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const userData = await signInWithEmailPassword(email, password);
      set(applyUser(userData));
    } catch (error: any) {
      set({ error: error.message || "Authentication failed.", loading: false, isAuthenticated: false });
    }
  },

  // ── Sign Out ────────────────────────────────────────────────────────────────
  signOut: async () => {
    try {
      set({ loading: true });
      await signOutUser();
      set({
        user: null,
        isAuthenticated: false,
        isSuperAdmin: false,
        isStudent: false,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      set({ error: error.message || "Sign out failed.", loading: false });
    }
  },

  // ── Auth State Listener ─────────────────────────────────────────────────────
  // Subscribes to Firebase onAuthStateChanged.
  // On every page load this fires once with the persisted Firebase user (if any),
  // so the session is restored automatically without re-logging in.
  initializeAuth: () => {
    const unsubscribe = subscribeToAuthState(async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          set({
            user: null,
            isAuthenticated: false,
            isSuperAdmin: false,
            isStudent: false,
            loading: false,
          });
          return;
        }

        // Firebase user exists — fetch or create their Firestore profile
        const db = getFirebaseDb();
        const userRef = doc(db, "users", firebaseUser.uid);
        const snapshot = await getDoc(userRef);

        if (snapshot.exists()) {
          set(applyUser(snapshot.data() as UserDoc));
        } else {
          // Doc missing (e.g. first sign-in via redirect) — create it now
          const userData = await getOrCreateUserDoc(firebaseUser.uid, {
            name: firebaseUser.displayName || "",
            email: firebaseUser.email || "",
            role: "student",
            photoURL: firebaseUser.photoURL || undefined,
          });
          set(applyUser(userData));
        }
      } catch (error) {
        console.error("onAuthStateChanged error:", error);
        set({ loading: false });
      }
    });

    return unsubscribe;
  },
}));
