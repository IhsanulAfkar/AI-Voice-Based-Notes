import { apiMiddleware } from "@/app/api/middleware";
import { prisma } from "@/lib/prisma";
import { markdownToHtml } from "@/lib/utils";
import { Note } from "@prisma/client";
import { NextResponse } from "next/server";

export const PUT = apiMiddleware(async (req, session, { params }) => {
    try {
        const uuid = params!.id;
        const { content } = await req.json()
        const conversation = await prisma.conversation.findFirst({
            where: {
                uuid,
                user_id: session.user.id
            },
            include: {
                Note: {
                    orderBy: {
                        id: 'desc',
                    },
                    take: 1,
                }
            }
        })
        if (!conversation) {
            return NextResponse.json({ message: "Conversation or note not found" }, {
                status: 404
            })
        }
        let note: Note
        if (conversation.Note.length == 0) {
            note = await prisma.note.create({
                data: {
                    content,
                    conversationId: conversation.id
                }
            })
        } else {
            note = conversation.Note[0]
            await prisma.note.update({
                where: {
                    id: note.id
                },
                data: {
                    content,
                }
            })
        }
        return NextResponse.json({
            message: "Success update note"
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({
            message: "Server Error"
        }, { status: 500 });
    }
})
export const GET = apiMiddleware(async (req, session, { params }) => {
    try {
        const uuid = params!.id;
        let note: Note | null
        const conversation = await prisma.conversation.findFirst({
            where: {
                user_id: session.user.id,
                uuid: uuid
            }
        })
        if (!conversation) {
            return NextResponse.json({ message: "Conversation not found" }, { status: 404 })
        }
        note = await prisma.note.findFirst({
            where: {
                conversationId: conversation?.id,
                conversation: {
                    user_id: session.user.id
                }
            }
        })
        if (!note) {
            return NextResponse.json({})
        }
        note = {
            ...note,
            content: markdownToHtml(note.content)
        }
        return NextResponse.json(note)
    } catch (error) {
        return NextResponse.json({
            message: "Server Error"
        }, { status: 500 });
    }
})
export const DELETE = apiMiddleware(async (req, session, { params }) => {
    try {
        const uuid = params!.id;
        let note: Note | null
        const conversation = await prisma.conversation.findFirst({
            where: {
                user_id: session.user.id,
                uuid: uuid
            }
        })
        if (!conversation) {
            return NextResponse.json({ message: "Conversation not found" }, { status: 404 })
        }
        note = await prisma.note.findFirst({
            where: {
                conversationId: conversation?.id,
                conversation: {
                    user_id: session.user.id
                }
            }
        })
        await prisma.note.delete({
            where: {
                id: note?.id
            }
        })
        return NextResponse.json({ message: "Note has been cleared!" })
    } catch (error) {
        return NextResponse.json({
            message: "Server Error"
        }, { status: 500 });
    }
})

