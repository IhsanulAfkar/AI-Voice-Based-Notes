import NextAuth, { NextAuthConfig } from "next-auth"
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from "./lib/prisma"
import Google from "next-auth/providers/google"
import route from "./route"
export const authConfig = {
    providers: [
        Google
    ],
    pages: {
        signIn: route('signin')
    },
    secret:process.env.AUTH_SECRET,
    session:{
        strategy:'database'
    }
} satisfies NextAuthConfig
export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    ...authConfig
})
