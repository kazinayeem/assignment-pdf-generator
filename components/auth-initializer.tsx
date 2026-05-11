"use client";

/**
 * AuthInitializer
 *
 * For popup auth, only onAuthStateChanged listener is required.
 */

import { useEffect } from "react";
import { useAuthStore } from "@/lib/auth-store";

export function AuthInitializer() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    console.log("🔍 [AUTH-INITIALIZER] Component mounted, starting auth initialization...");
    let unsubscribe: (() => void) | undefined;

    const init = async () => {
      console.log("🔍 [AUTH-INITIALIZER] Starting onAuthStateChanged listener...");
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
