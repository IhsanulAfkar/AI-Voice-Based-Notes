import NextAuth from "next-auth"
import { authConfig } from "./auth"
import route from "./route"
const { auth: middleware } = NextAuth(authConfig)
export default middleware(req => {
    if (!req.auth && req.nextUrl.pathname !== route('signin')) {
        const newUrl = new URL(route('signin'), req.nextUrl.origin)
        return Response.redirect(newUrl)
    }
})
export const config = {
    matcher: ['/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)'],
}