import { auth } from "@/auth"
import { AuthenticatedSession, TSession } from "@/types"
import { NextRequest, NextResponse } from "next/server"

type Handler = (req: NextRequest, session: AuthenticatedSession) => Promise<NextResponse>


export const apiMiddleware = (handler: Handler) => {
    return async (req: NextRequest) => {
        const session = await auth()
        
        // if (!session || !session.user) {
        //     return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        // }
        return handler(req, session as AuthenticatedSession)

    }
}
