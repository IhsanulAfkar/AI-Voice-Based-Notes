import NextAuth, { NextAuthConfig } from "next-auth"
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from "./lib/prisma"
import Google from "next-auth/providers/google"
import route from "./route"
export const authConfig = {
    providers: [
        Google
    ],
    callbacks: {
        async session({ token, session }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
            }
            return session;
        },
        async jwt({ token, user, profile }) {
            return token;
        },
    },

} satisfies NextAuthConfig
export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    pages: {
        signIn: route('signin')
    },
    secret: process.env.AUTH_SECRET,
    ...authConfig
})
