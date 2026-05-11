import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import type { JWT } from "next-auth/jwt";

const DIU_EMAIL_DOMAIN = "diu.edu.bd";
const SUPER_ADMIN_EMAIL = "admin@admin.com";
const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD || "123456";

function isAllowedEmail(email?: string | null) {
  if (!email) return false;
  const normalized = email.toLowerCase();
  return normalized === SUPER_ADMIN_EMAIL || normalized.endsWith(`@${DIU_EMAIL_DOMAIN}`);
}

function resolveRole(email?: string | null): "student" | "super-admin" {
  return email?.toLowerCase() === SUPER_ADMIN_EMAIL ? "super-admin" : "student";
}

const googleClientId = process.env.AUTH_GOOGLE_ID || "";
const googleClientSecret = process.env.AUTH_GOOGLE_SECRET || "";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    // ── Google OAuth (for students with @diu.edu.bd) ──────────────────────────
    Google({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    }),

    // ── Credentials (for super-admin email/password login) ────────────────────
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = (credentials?.email as string)?.toLowerCase().trim();
        const password = credentials?.password as string;

        if (!email || !password) return null;

        // Only super-admin can use credentials login
        if (email !== SUPER_ADMIN_EMAIL) return null;
        if (password !== SUPER_ADMIN_PASSWORD) return null;

        return {
          id: "super-admin",
          email: SUPER_ADMIN_EMAIL,
          name: "Super Admin",
          role: "super-admin" as const,
        };
      },
    }),
  ],
  callbacks: {
    // Block Google sign-in for non-DIU emails
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        const email = (profile as { email?: string } | undefined)?.email;
        return isAllowedEmail(email);
      }
      // Credentials provider — already validated in authorize()
      return true;
    },

    async jwt({ token, account, profile, user }) {
      // On initial sign-in, enrich the token
      if (account?.provider === "google" && profile) {
        const profileData = profile as { email?: string; name?: string; picture?: string };
        const email = profileData.email?.toLowerCase() || "";
        token.uid = token.sub || account.providerAccountId || email;
        token.role = resolveRole(email);
        token.name = profileData.name || token.name;
        token.picture = profileData.picture || token.picture;
        token.email = email;
      }
      if (account?.provider === "credentials" && user) {
        token.uid = "super-admin";
        token.role = "super-admin";
        token.email = SUPER_ADMIN_EMAIL;
        token.name = "Super Admin";
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.uid as string) || token.sub || session.user.email || "";
        session.user.role = (token.role as "student" | "super-admin") || resolveRole(session.user.email);
      }
      return session;
    },
  },
});

export type AppJWT = JWT & {
  uid?: string;
  role?: "student" | "super-admin";
};
