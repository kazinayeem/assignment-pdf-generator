import "next-auth";
import "next-auth/jwt";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "student" | "super-admin";
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: "student" | "super-admin";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    uid?: string;
    role?: "student" | "super-admin";
  }
}
