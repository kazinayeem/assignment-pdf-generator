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

  // Initiates Google sign-in (popup in dev, redirect in prod)
  signInWithGoogle: async () => {
    try {
      set({ loading: true, error: null });
      console.log("🔍 [AUTH-STORE] signInWithGoogle: Starting...");
      
      const userData = await initiateGoogleSignIn();
      
      if (userData) {
        // Popup flow (dev) - user data returned immediately
        console.log("✅ [AUTH-STORE] Popup sign-in completed, applying user:", userData);
        set(applyUser(userData));
      } else {
        // Redirect flow (prod) - page will navigate away
        console.log("🔍 [AUTH-STORE] Redirect initiated, page will reload...");
      }
    } catch (error: any) {
      console.error("❌ [AUTH-STORE] Google sign-in failed:", error);
      set({ error: error.message || "Failed to start Google sign-in.", loading: false });
    }
  },

  // Called by AuthInitializer BEFORE onAuthStateChanged starts.
  // Only needed for redirect flow (production). In dev, popup returns immediately.
  handleRedirectResult: async () => {
    const isDev = process.env.NODE_ENV === 'development';
    
    if (isDev) {
      console.log("🔍 [AUTH-STORE] handleRedirectResult: Skipping (dev uses popup flow)");
      return;
    }
    
    console.log("🔍 [AUTH-STORE] handleRedirectResult: Starting (production redirect flow)...");
    try {
      console.log("🔍 [AUTH-STORE] Calling handleGoogleRedirectResult...");
      const userData = await handleGoogleRedirectResult();

      if (userData) {
        // Redirect just completed — apply the user immediately
        console.log("✅ [AUTH-STORE] Redirect completed! Applying user:", userData);
        set(applyUser(userData));
        console.log("✅ [AUTH-STORE] User applied to store. isAuthenticated should be true now.");
      } else {
        console.log("🔍 [AUTH-STORE] No redirect result (normal page load)");
      }
    } catch (error: any) {
      console.error("❌ [AUTH-STORE] Redirect result error:", error);
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
    console.log("🔍 [AUTH-STORE] initializeAuth: Setting up onAuthStateChanged listener...");
    const auth = getFirebaseAuth();
    const db = getFirebaseDb();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("🔍 [AUTH-STORE] onAuthStateChanged fired:", firebaseUser ? `User: ${firebaseUser.email}` : "No user");
      try {
        if (!firebaseUser) {
          console.log("🔍 [AUTH-STORE] No Firebase user - setting unauthenticated state");
          set({
            user: null,
            isAuthenticated: false,
            isSuperAdmin: false,
            isStudent: false,
            loading: false,
          });
          return;
        }

        console.log("🔍 [AUTH-STORE] Firebase user exists, fetching Firestore doc...");
        // Fetch Firestore profile for the signed-in user
        const userRef = doc(db, "users", firebaseUser.uid);
        const snapshot = await getDoc(userRef);

        if (snapshot.exists()) {
          const userData = snapshot.data() as UserDoc;
          console.log("✅ [AUTH-STORE] Firestore doc found, applying user:", userData);
          set(applyUser(userData));
        } else {
          console.log("⚠️ [AUTH-STORE] Firestore doc missing - redirect handler should create it");
          // Doc missing — redirect result handler will create it
          set({ loading: false });
        }
      } catch (error) {
        console.error("❌ [AUTH-STORE] onAuthStateChanged error:", error);
        set({ loading: false });
      }
    });

    return unsubscribe;
  },
}));
