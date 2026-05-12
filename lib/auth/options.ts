import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { Role } from "@prisma/client";

import { isOwnerEmail } from "@/lib/auth/owner";
import { isDatabaseConfigured, isGoogleAuthConfigured } from "@/lib/env";
import { prisma } from "@/lib/prisma";

const providers: NextAuthOptions["providers"] = [];

if (isGoogleAuthConfigured()) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  );
}

export const authOptions: NextAuthOptions = {
  adapter: isDatabaseConfigured() ? PrismaAdapter(prisma) : undefined,
  providers,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/",
  },
  callbacks: {
    async signIn({ user }) {
      if (user.email && isDatabaseConfigured() && isOwnerEmail(user.email)) {
        await prisma.user.update({
          where: { email: user.email },
          data: { role: Role.OWNER },
        }).catch(() => undefined);
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id;
      }

      if (user?.email && isOwnerEmail(user.email)) {
        token.role = "OWNER";
      }

      if (token.email && isDatabaseConfigured()) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true, role: true },
        });

        if (dbUser) {
          token.sub = dbUser.id;
          token.role = dbUser.role;
        }
      }

      if (!token.role) {
        token.role = "USER";
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = token.role === "OWNER" ? "OWNER" : "USER";
      }
      return session;
    },
  },
};
