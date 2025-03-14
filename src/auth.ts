import NextAuth, { DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/prisma";

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }
}

export const { signIn, signOut, auth, handlers } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: UserRole.USER,
        };
      },
    }),
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID || "",
      clientSecret: process.env.AUTH_GITHUB_SECRET || "",
      profile(profile) {
        return {
          id: String(profile.id),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          role: UserRole.USER, // Default role for new users
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      // Attach `role` and `id` to the session object
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      session.user.role = (user as any).role ?? UserRole.USER; // No need for type assertion if Prisma schema is correct
      session.user.id = user.id;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Ensure redirect URL is valid; fallback to baseUrl if not
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  session: {
    strategy: "jwt",
  },
  cookies: {
    sessionToken: {
      name: "__Secure-authjs.session-token",
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        // Only set domain if you're sure it matches your production domain
        domain: process.env.NODE_ENV === "production" ? "prepflow.vercel.app" : undefined,
      },
    },
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/signin",
  },
});