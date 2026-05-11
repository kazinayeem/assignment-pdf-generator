"use client";

/**
 * AuthInitializer
 *
 * CRITICAL ORDER — must be:
 *   1. getRedirectResult() FIRST  — captures the Google redirect before anything else
 *   2. onAuthStateChanged AFTER   — only starts listening once redirect is resolved
 */

import { useEffect } from "react";
import { useAuthStore } from "@/lib/auth-store";

export function AuthInitializer() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const handleRedirectResult = useAuthStore((state) => state.handleRedirectResult);

  useEffect(() => {
    console.log("🔍 [AUTH-INITIALIZER] Component mounted, starting auth initialization...");
    let unsubscribe: (() => void) | undefined;

    const init = async () => {
      console.log("🔍 [AUTH-INITIALIZER] Step 1: Processing redirect result...");
      await handleRedirectResult();
      console.log("🔍 [AUTH-INITIALIZER] Step 1 complete. Waiting briefly for state to settle...");

      await new Promise((resolve) => setTimeout(resolve, 100));

      console.log("🔍 [AUTH-INITIALIZER] Step 2: Starting onAuthStateChanged listener...");
      unsubscribe = initializeAuth();
      console.log("✅ [AUTH-INITIALIZER] Auth initialization complete!");
    };

    init();

    return () => {
      console.log("🔍 [AUTH-INITIALIZER] Component unmounting, cleaning up listener...");
      unsubscribe?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
