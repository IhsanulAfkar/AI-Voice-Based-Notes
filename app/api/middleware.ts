import { auth } from "@/auth"
import { AuthenticatedSession, TSession } from "@/types"
import { NextApiRequest, NextApiResponse } from "next"
import { NextRequest, NextResponse } from "next/server"

type Handler = (req: NextRequest, session: AuthenticatedSession,
    context: { params?: Record<any, string> }
) => Promise<any> | void
type PagesHandler = (req: NextApiRequest, res: NextApiResponse, session: AuthenticatedSession) => Promise<NextApiResponse | void> | void


export const apiMiddleware = (handler: Handler) => {
    return async (req: NextRequest,context: { params?: Record<string, string> }) => {
        const session = await auth()

        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }
        context.params = await context.params;
        return handler(req, session as AuthenticatedSession, context)

    }
}

export const apiPagesMiddleware = (handler: PagesHandler) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        const session = await auth(req, res)

        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }
        return handler(req, res, session as AuthenticatedSession)

    }
}