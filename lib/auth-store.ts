"use client";

/**
 * auth-store.ts
 *
 * Zustand store that syncs from the NextAuth session.
 * NextAuth handles Google OAuth. Firebase Firestore stores user profile data.
 * No Firebase Auth is used.
 */

import { create } from "zustand";
import { signIn, signOut } from "next-auth/react";
import type { Session } from "next-auth";
import { getOrCreateUserDoc, resolveRole } from "./auth-utils";
import type { UserDoc, AuthContextType } from "./types";

// ─── Store Interface ──────────────────────────────────────────────────────────

interface AuthStore extends AuthContextType {
  /** Called by AuthInitializer whenever the NextAuth session changes */
  syncSession: (session: Session | null, status: string) => Promise<void>;
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

  setError: (error) => set({ error }),

  // ── Google Sign-In via NextAuth ─────────────────────────────────────────────
  signInWithGoogle: async () => {
    try {
      set({ loading: true, error: null });
      // NextAuth handles the full OAuth redirect flow
      await signIn("google", { callbackUrl: "/login" });
    } catch (error: any) {
      set({ error: error.message || "Google sign-in failed.", loading: false });
    }
  },

  // ── Email / Password (super-admin only via NextAuth credentials) ────────────
  signInWithEmailPassword: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        set({ error: "Invalid credentials.", loading: false, isAuthenticated: false });
      }
      // On success, useSession will update → AuthInitializer → syncSession will fire
    } catch (error: any) {
      set({ error: error.message || "Authentication failed.", loading: false, isAuthenticated: false });
    }
  },

  // ── Sign Out ────────────────────────────────────────────────────────────────
  signOut: async () => {
    try {
      set({ loading: true });
      await signOut({ callbackUrl: "/" });
    } catch (error: any) {
      set({ error: error.message || "Sign out failed.", loading: false });
    }
  },

  // ── Sync from NextAuth session ──────────────────────────────────────────────
  // Called by AuthInitializer on every session change.
  // Fetches/creates the Firestore user doc and applies it to the store.
  syncSession: async (session, status) => {
    // Still loading NextAuth session — keep loading:true
    if (status === "loading") {
      set({ loading: true });
      return;
    }

    // No session — user is not signed in
    if (!session?.user?.email || !session.user.id) {
      set({
        user: null,
        isAuthenticated: false,
        isSuperAdmin: false,
        isStudent: false,
        loading: false,
        error: null,
      });
      return;
    }

    try {
      const email = session.user.email.toLowerCase();
      const role = session.user.role || resolveRole(email);

      // Fetch or create the Firestore user document
      const userData = await getOrCreateUserDoc(session.user.id, {
        name: session.user.name || "",
        email,
        role,
        photoURL: session.user.image ?? undefined,
      });

      set(applyUser(userData));
    } catch (error: any) {
      console.error("syncSession error:", error);
      set({ error: error.message || "Failed to load user data.", loading: false });
    }
  },
}));
