import { AuthenticatedSession } from "@/types";
import { apiMiddleware } from "../middleware";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const GET = apiMiddleware(async (req: NextRequest, session: AuthenticatedSession) => {
    try {
        let conversations = await prisma.conversation.findMany({
            where: {
                user_id: session.user.id,
                title: {
                    not: null
                }
            },
            include: {
                Message: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                    take: 1,
                },
            },
        })
        conversations = conversations.sort((a, b) => {
            const dateA = a.Message[0]?.createdAt ?? new Date(0);
            const dateB = b.Message[0]?.createdAt ?? new Date(0);
            return dateB.getTime() - dateA.getTime();
        });
        return NextResponse.json(conversations)
    } catch (error) {
        console.error(error)
        return NextResponse.json({
            message: "Server Error"
        }, { status: 500 });
    }
})
type TBody = {
    message: string
}
export const POST = apiMiddleware(async (req, session) => {
    try {
        const { message }: TBody = await req.json()
        if (!message) return NextResponse.json({ message: 'message cannot be empty' }, { status: 400 })
        const conversation = await prisma.conversation.create({
            data: {
                user_id: session.user.id!,
                title: 'New Title',
                Message: {
                    create: {
                        content: message,
                        role: 'user',
                    }
                }
            }
        })
        return NextResponse.json(conversation)
    } catch (error) {
        return NextResponse.json({
            message: "Server Error"
        }, { status: 500 });
    }
})