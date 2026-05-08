/**
 * auth-store.ts
 * Zustand store for authentication state.
 *
 * Firebase instances are accessed via lazy getters — safe to import anywhere.
 * Google sign-in uses redirect flow (no popups).
 */

"use client";

import { create } from "zustand";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { getFirebaseAuth, getFirebaseDb } from "./firebase-config";
import {
  initiateGoogleSignIn,
  handleGoogleRedirectResult,
  signInWithEmailPassword,
  signOutUser,
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

  // Initiates Google redirect — page navigates away, no return value
  signInWithGoogle: async () => {
    try {
      set({ loading: true, error: null });
      await initiateGoogleSignIn();
    } catch (error: any) {
      console.error("Google sign-in initiation failed:", error);
      set({ error: error.message || "Failed to start Google sign-in.", loading: false });
    }
  },

  // Called by AuthInitializer BEFORE onAuthStateChanged starts.
  // Keeps loading:true while getRedirectResult() is in-flight so
  // useProtectedRoute never sees a false-negative unauthenticated state.
  handleRedirectResult: async () => {
    try {
      // loading is already true from initial state — keep it that way
      const userData = await handleGoogleRedirectResult();

      if (userData) {
        // Redirect just completed — apply the user immediately
        set(applyUser(userData));
      }
      // If null (normal load), do nothing — onAuthStateChanged will set loading:false
    } catch (error: any) {
      console.error("Redirect result error:", error);
      // Only set loading:false on error — onAuthStateChanged handles the success path
      set({ error: error.message || "Google sign-in failed.", loading: false });
    }
  },

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

  initializeAuth: () => {
    const auth = getFirebaseAuth();
    const db = getFirebaseDb();

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

        // Fetch Firestore profile for the signed-in user
        const userRef = doc(db, "users", firebaseUser.uid);
        const snapshot = await getDoc(userRef);

        if (snapshot.exists()) {
          set(applyUser(snapshot.data() as UserDoc));
        } else {
          // Doc missing — redirect result handler will create it
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
