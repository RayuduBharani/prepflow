/* eslint-disable @typescript-eslint/no-explicit-any */
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
      leetcode_username: string | null;
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
      session.user.id = user.id;
      session.user.role = (user as any).role ?? UserRole.USER;
      session.user.leetcode_username = (user as any).leetcode_username ?? null;
      return session;
    },
    async signIn({ user }) {
      try {
        const existingUser = await prisma.user.findUnique({
          where: { id: user.id },
        });
        if (existingUser) {
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
          });
        }
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return true;
      }
    },
    async redirect({ url, baseUrl }) {
      // Ensure redirect URL is valid; fallback to baseUrl if not
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  session: {
    strategy: "database",
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/signin",
  },
  trustHost: true,
});
