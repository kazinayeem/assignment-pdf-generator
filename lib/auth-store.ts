/**
 * auth-store.ts
 * Zustand store for authentication state.
 * Google sign-in uses redirect flow — no popups.
 */

"use client";

import { create } from "zustand";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase-config";
import {
  initiateGoogleSignIn,
  handleGoogleRedirectResult,
  signInWithEmailPassword,
  signOutUser,
} from "./auth-utils";
import type { UserDoc, AuthContextType } from "./types";

// ─── Store Interface ──────────────────────────────────────────────────────────

interface AuthStore extends AuthContextType {
  /** Call once on app mount — sets up onAuthStateChanged listener */
  initializeAuth: () => () => void;
  /** Process the Google redirect result after returning from Google */
  handleRedirectResult: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  signInWithEmailPassword: (email: string, password: string) => Promise<void>;
}

// ─── Helper: apply a UserDoc to the store ────────────────────────────────────

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
  loading: true, // true until onAuthStateChanged fires
  error: null,
  isAuthenticated: false,
  isSuperAdmin: false,
  isStudent: false,

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // ── Google Sign-In (redirect) ──────────────────────────────────────────────
  signInWithGoogle: async () => {
    try {
      set({ loading: true, error: null });
      // Navigates away — execution does not continue past this line
      await initiateGoogleSignIn();
    } catch (error: any) {
      console.error("Google sign-in initiation failed:", error);
      set({ error: error.message || "Failed to start Google sign-in.", loading: false });
    }
  },

  // ── Handle redirect result (called by AuthInitializer on every page load) ──
  handleRedirectResult: async () => {
    try {
      const userData = await handleGoogleRedirectResult();

      // null means no redirect was pending — nothing to do
      if (!userData) return;

      set(applyUser(userData));
    } catch (error: any) {
      console.error("Redirect result error:", error);
      set({ error: error.message || "Google sign-in failed.", loading: false });
    }
  },

  // ── Email / Password (admin) ───────────────────────────────────────────────
  signInWithEmailPassword: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const userData = await signInWithEmailPassword(email, password);
      set(applyUser(userData));
    } catch (error: any) {
      console.error("Email sign-in error:", error);
      set({ error: error.message || "Authentication failed.", loading: false, isAuthenticated: false });
    }
  },

  // ── Sign Out ───────────────────────────────────────────────────────────────
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

  // ── Auth State Listener ────────────────────────────────────────────────────
  initializeAuth: () => {
    /**
     * onAuthStateChanged fires:
     *   1. Immediately on mount with the persisted session (or null)
     *   2. After every sign-in / sign-out
     *
     * We do NOT handle the redirect result here — that's done separately in
     * handleRedirectResult() so we can surface errors to the UI properly.
     */
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
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

        // User is signed in — fetch their Firestore profile
        const userRef = doc(db, "users", firebaseUser.uid);
        const snapshot = await getDoc(userRef);

        if (snapshot.exists()) {
          const userData = snapshot.data() as UserDoc;
          set(applyUser(userData));
        } else {
          // Firestore doc missing (edge case) — keep Firebase session but mark unauthenticated
          // The redirect result handler will create the doc when it runs
          set({ loading: false });
        }
      } catch (error) {
        console.error("onAuthStateChanged error:", error);
        set({ loading: false });
      }
    });

    return unsubscribe;
  },
}));
