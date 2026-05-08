"use client";

/**
 * AuthInitializer
 *
 * CRITICAL ORDER — must be:
 *   1. getRedirectResult() FIRST  — captures the Google redirect before anything else
 *   2. onAuthStateChanged AFTER   — only starts listening once redirect is resolved
 *
 * Why order matters:
 *   When the user returns from Google, onAuthStateChanged fires immediately with
 *   null (Firebase hasn't processed the redirect yet). If we start the listener
 *   first, useProtectedRoute sees loading:false + isAuthenticated:false and
 *   redirects back to /login before the redirect result is ever processed.
 *
 *   By awaiting getRedirectResult() first and keeping loading:true throughout,
 *   the protected route waits until we know the real auth state.
 */

import { useEffect } from "react";
import { useAuthStore } from "@/lib/auth-store";

export function AuthInitializer() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const handleRedirectResult = useAuthStore((state) => state.handleRedirectResult);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const init = async () => {
      // Step 1: Process any pending Google redirect result FIRST.
      // This keeps loading:true until we know if a redirect just completed.
      // On normal page loads getRedirectResult() resolves immediately with null.
      await handleRedirectResult();

      // Step 2: Start the persistent auth state listener.
      // By this point the redirect result (if any) is already in Firestore,
      // so onAuthStateChanged will see the signed-in user correctly.
      unsubscribe = initializeAuth();
    };

    init();

    return () => unsubscribe?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
