"use client";

/**
 * AuthInitializer
 *
 * Bootstraps Firebase auth on every page load.
 *
 * Order matters:
 *   1. handleRedirectResult() — captures Google redirect result (prod only).
 *      Keeps loading:true so protected routes don't flash a redirect to /login.
 *   2. initializeAuth()       — starts onAuthStateChanged listener.
 *      Firebase persists the session in IndexedDB/localStorage, so this fires
 *      immediately with the signed-in user on every subsequent page load.
 *      This is what keeps the user logged in across refreshes.
 */

import { useEffect } from "react";
import { useAuthStore } from "@/lib/auth-store";

export function AuthInitializer() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const handleRedirectResult = useAuthStore((state) => state.handleRedirectResult);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const init = async () => {
      // Step 1: Process any pending Google redirect result (production only).
      await handleRedirectResult();

      // Step 2: Start the persistent Firebase auth state listener.
      // Firebase automatically restores the session from local storage,
      // so onAuthStateChanged fires with the user on every page load.
      unsubscribe = initializeAuth();
    };

    init();

    return () => unsubscribe?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
