import { NextRequest, NextResponse } from "next/server";
import { apiMiddleware } from "../../middleware";
import { AuthenticatedSession } from "@/types";
import { prisma } from "@/lib/prisma";

export const GET = apiMiddleware(async (req, session, { params }) => {
    try {
        const id = params!.id;
        const conversation = await prisma.conversation.findFirst({
            where: {
                user_id: session.user.id,
                uuid: id
            },
            include: {
                Message: true
            }
        })
        if (!conversation) {
            return NextResponse.json({
                message: "Conversation not found"
            }, { status: 404 })
        }
        return NextResponse.json(conversation.Message)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: 'Server Error', error: error }, { status: 500 })
    }
})

export const DELETE = apiMiddleware(async (req, session, { params }) => {
    try {
        const id = params!.id;
        const conversation = await prisma.conversation.findFirst({
            where: {
                user_id: session.user.id,
                uuid: id
            },
            include: {
                Message: true
            }
        })
        if (!conversation) {
            return NextResponse.json({
                message: "Conversation not found"
            }, { status: 404 })
        }
        await prisma.conversation.delete({
            where: {
                id: conversation.id
            }
        })
        return NextResponse.json({
            message: 'Success delete conversation'
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: 'Server Error', error: error }, { status: 500 })
    }
})