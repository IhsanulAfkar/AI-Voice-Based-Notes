import { Session } from 'next-auth'
export type TRoute = (name: string, params?: { [key: string]: any }) => string
export type TRoutes = { [key: string]: { path: string } }

export type TSession = Session