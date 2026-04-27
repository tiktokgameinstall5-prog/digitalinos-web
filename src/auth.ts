import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) return null;
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;
        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          role: user.role,
        };
      },
    }),
    ...(env.GOOGLE_ENABLED
      ? [
          Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.uid = (user as { id?: string }).id;
        token.role = (user as { role?: "USER" | "ADMIN" }).role ?? "USER";
      }
      if (!token.role && token.email) {
        const u = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true, role: true },
        });
        if (u) {
          token.uid = u.id;
          token.role = u.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.uid as string | undefined;
        (session.user as { role?: "USER" | "ADMIN" }).role =
          (token.role as "USER" | "ADMIN" | undefined) ?? "USER";
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      if (!user?.email) return;
      // Promote bootstrap admin by email.
      if (
        env.ADMIN_EMAIL &&
        user.email.toLowerCase() === env.ADMIN_EMAIL.toLowerCase()
      ) {
        await prisma.user
          .update({
            where: { email: user.email },
            data: { role: "ADMIN" },
          })
          .catch(() => {
            /* ignore if user not in DB yet (Credentials edge case) */
          });
      }
    },
  },
});
