"use client";

/**
 * AuthInitializer
 *
 * Syncs the Zustand auth store from the NextAuth session.
 * NextAuth handles Google OAuth and JWT sessions.
 * Firebase Firestore stores user profile data.
 */

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/lib/auth-store";

export function AuthInitializer() {
  const { data: session, status } = useSession();
  const syncSession = useAuthStore((state) => state.syncSession);

  useEffect(() => {
    // Sync Zustand store whenever NextAuth session changes
    syncSession(session ?? null, status);
  }, [session, status, syncSession]);

  return null;
}
