import { create } from "zustand";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "./firebase-config";
import type { UserDoc, AuthContextType } from "./types";

const DIU_EMAIL_DOMAIN = "diu.edu.bd";
const SUPER_ADMIN_EMAIL = "admin@admin.com";

function buildUserDoc(user: {
  uid: string;
  name: string;
  email: string;
  role: "student" | "super-admin";
  photoURL?: string | null;
}): UserDoc {
  return {
    uid: user.uid,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: new Date().toISOString(),
    ...(user.photoURL ? { photoURL: user.photoURL } : {}),
  };
}

interface AuthStore extends AuthContextType {
  initializeAuth: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  signInWithEmailPassword: (email: string, password: string) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false,
  isSuperAdmin: false,
  isStudent: false,

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  signInWithGoogle: async () => {
    try {
      set({ loading: true, error: null });

      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      // Validate email domain
      if (!firebaseUser.email?.endsWith(`@${DIU_EMAIL_DOMAIN}`)) {
        await firebaseSignOut(auth);
        set({
          error: "Only DIU student email accounts are allowed",
          loading: false,
        });
        throw new Error("Only DIU student email accounts are allowed");
      }

      // Check if user exists in Firestore
      const userRef = doc(db, "users", firebaseUser.uid);
      const userDoc = await getDoc(userRef);

      let userData: UserDoc;

      if (userDoc.exists()) {
        userData = userDoc.data() as UserDoc;
      } else {
        // Create new user document
        userData = buildUserDoc({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || "",
          email: firebaseUser.email || "",
          role: "student",
          photoURL: firebaseUser.photoURL,
        });

        await setDoc(userRef, userData);
      }

      set({
        user: userData,
        isAuthenticated: true,
        isSuperAdmin: userData.role === "super-admin",
        isStudent: userData.role === "student",
        loading: false,
        error: null,
      });
    } catch (error: any) {
      console.error("Auth error:", error);
      set({
        error: error.message || "Authentication failed",
        loading: false,
        isAuthenticated: false,
      });
    }
  },

  signInWithEmailPassword: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });

      let result;

      try {
        result = await signInWithEmailAndPassword(auth, email, password);
      } catch (error: any) {
        if (email.toLowerCase() !== SUPER_ADMIN_EMAIL) {
          throw error;
        }

        if (error?.code === "auth/invalid-credential" || error?.code === "auth/user-not-found") {
          result = await createUserWithEmailAndPassword(auth, email, password);
        } else {
          throw error;
        }
      }

      const firebaseUser = result.user;

      const isSuperAdminEmail = email.toLowerCase() === SUPER_ADMIN_EMAIL;
      const isDiuEmail = email.toLowerCase().endsWith(`@${DIU_EMAIL_DOMAIN}`);

      if (!isSuperAdminEmail && !isDiuEmail) {
        await firebaseSignOut(auth);
        set({
          error: "Only DIU email accounts or the super admin account are allowed",
          loading: false,
        });
        throw new Error("Only DIU email accounts or the super admin account are allowed");
      }

      const userRef = doc(db, "users", firebaseUser.uid);
      const userDoc = await getDoc(userRef);

      let userData: UserDoc;

      if (userDoc.exists()) {
        userData = userDoc.data() as UserDoc;
      } else {
        userData = buildUserDoc({
          uid: firebaseUser.uid,
          name: isSuperAdminEmail ? "Super Admin" : firebaseUser.displayName || "",
          email: firebaseUser.email || email,
          role: isSuperAdminEmail ? "super-admin" : "student",
          photoURL: firebaseUser.photoURL,
        });

        await setDoc(userRef, userData);
      }

      set({
        user: userData,
        isAuthenticated: true,
        isSuperAdmin: userData.role === "super-admin",
        isStudent: userData.role === "student",
        loading: false,
        error: null,
      });
    } catch (error: any) {
      console.error("Auth error:", error);
      set({
        error: error.message || "Authentication failed",
        loading: false,
        isAuthenticated: false,
      });
    }
  },

  signOut: async () => {
    try {
      set({ loading: true });
      await firebaseSignOut(auth);
      set({
        user: null,
        isAuthenticated: false,
        isSuperAdmin: false,
        isStudent: false,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || "Sign out failed",
        loading: false,
      });
    }
  },

  initializeAuth: () => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const userData = userDoc.data() as UserDoc;
            set({
              user: userData,
              isAuthenticated: true,
              isSuperAdmin: userData.role === "super-admin",
              isStudent: userData.role === "student",
              loading: false,
            });
          } else if (firebaseUser.email?.toLowerCase() === SUPER_ADMIN_EMAIL) {
            const userData = buildUserDoc({
              uid: firebaseUser.uid,
              name: "Super Admin",
              email: firebaseUser.email,
              role: "super-admin",
              photoURL: firebaseUser.photoURL,
            });

            await setDoc(userRef, userData);
            set({
              user: userData,
              isAuthenticated: true,
              isSuperAdmin: true,
              isStudent: false,
              loading: false,
            });
          }
        } else {
          set({
            user: null,
            isAuthenticated: false,
            isSuperAdmin: false,
            isStudent: false,
            loading: false,
          });
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        set({ loading: false });
      }
    });

    return unsubscribe;
  },
}));
