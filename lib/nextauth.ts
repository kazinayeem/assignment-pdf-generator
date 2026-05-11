import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import type { JWT } from "next-auth/jwt";

const DIU_EMAIL_DOMAIN = "diu.edu.bd";
const SUPER_ADMIN_EMAIL = "admin@admin.com";

function isAllowedEmail(email?: string | null) {
  if (!email) return false;
  const normalized = email.toLowerCase();
  return normalized === SUPER_ADMIN_EMAIL || normalized.endsWith(`@${DIU_EMAIL_DOMAIN}`);
}

function resolveRole(email?: string | null) {
  return email?.toLowerCase() === SUPER_ADMIN_EMAIL ? "super-admin" : "student";
}

const googleClientId = process.env.AUTH_GOOGLE_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
const googleClientSecret = process.env.AUTH_GOOGLE_SECRET || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || "";

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
    Google({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      const email = (profile as { email?: string } | undefined)?.email;
      return isAllowedEmail(email);
    },
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const profileData = profile as { email?: string; name?: string; picture?: string };
        const email = profileData.email?.toLowerCase() || token.email || "";
        token.uid = token.sub || account.providerAccountId || email;
        token.role = resolveRole(email);
        token.name = profileData.name || token.name;
        token.picture = profileData.picture || token.picture;
        token.email = email;
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
