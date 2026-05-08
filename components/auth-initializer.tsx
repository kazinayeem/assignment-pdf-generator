"use client";

/**
 * AuthInitializer
 * Mounts once at the root layout. Responsible for:
 *   1. Starting the onAuthStateChanged listener (persistent session restore)
 *   2. Processing the Google redirect result after the user returns from Google
 *
 * Must be a client component — Firebase Auth is browser-only.
 * Renders nothing to the DOM.
 */

import { useEffect } from "react";
import { useAuthStore } from "@/lib/auth-store";

export function AuthInitializer() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const handleRedirectResult = useAuthStore((state) => state.handleRedirectResult);

  useEffect(() => {
    // 1. Set up the persistent auth state listener
    const unsubscribe = initializeAuth();

    // 2. Check if we just returned from a Google redirect sign-in.
    //    getRedirectResult() resolves immediately with null on normal loads,
    //    so this is safe to call on every page load — no performance cost.
    handleRedirectResult();

    // Clean up the listener when the component unmounts
    return () => unsubscribe?.();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount only

  return null;
}
