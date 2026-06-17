import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { db } from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  basePath: "/api/auth",
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email as string),
        });

        if (!user || !user.password) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!passwordMatch) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const adminEmails =
          process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim()) || [];

        if (!adminEmails.includes(user.email!)) {
          return false;
        }

        const existingUser = await db.query.users.findFirst({
          where: eq(users.email, user.email!),
        });

        if (!existingUser) {
          await db.insert(users).values({
            email: user.email!,
            name: user.name || "Admin",
            avatar: user.image,
            role: "admin",
            password: null,
          });
        } else if (existingUser.role !== "admin") {
          await db
            .update(users)
            .set({ role: "admin" })
            .where(eq(users.id, existingUser.id));
        }
      }

      return true;
    },

    // FIX: Only query DB when the user first signs in (user object is present).
    // On subsequent requests, role and id are already in the token — no DB hit.
    async jwt({ token, user }) {
      if (user) {
        // First sign-in: persist role + id into the JWT
        if (user.role) {
          token.role = user.role;
          token.id = user.id;
        } else {
          // Google OAuth: role not on user object yet — fetch once
          const dbUser = await db.query.users.findFirst({
            where: eq(users.email, user.email!),
          });
          if (dbUser) {
            token.role = dbUser.role;
            token.id = dbUser.id;
          }
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});