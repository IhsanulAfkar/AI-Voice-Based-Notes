import { apiMiddleware } from "@/app/api/middleware";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createParser } from 'eventsource-parser';
import { config } from "@/config";
export const GET = apiMiddleware(async (req, session, { params }) => {
    try {
        const id = params!.id;
        const conversation = await prisma.conversation.findFirst({
            where: {
                user_id: session.user.id,
                uuid: id,
            },
            include: {
                Message: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                    take: 1,
                },
            },
        });
        if (!conversation) {
            return NextResponse.json({
                message: "Conversation not found"
            }, { status: 404 })
        }
        const lastMessage = conversation.Message[0]
        if (!lastMessage || lastMessage.role != 'user') {
            return NextResponse.json({
                message: "Conversation already started"
            }, { status: 400 })
        }
        // fetch the api
        const res = await fetch(config.NEXT_PUBLIC_BASE_URL + '/api/chat', {
            method: "POST",
            body: JSON.stringify({
                message: lastMessage.content,
                user_id: session.user.id,
                conversation_id: conversation.uuid
            }),
            headers: {
                'Accept': 'text/event-stream',
                'Content-Type': 'application/json'
            }
        });
        if (!res.ok) {
            return NextResponse.json({
                message: 'Failed to fetch chat'
            }, {
                status: 500
            })
        }
        const reader = res.body?.getReader();
        if (!reader) {
            return new Response('No stream found', { status: 500 });
        }
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();
        const stream = new ReadableStream({
            async start(controller) {
                const parser = createParser({
                    onEvent: (event) => {
                        const data = `data: ${event.data}\n\n`;
                        controller.enqueue(encoder.encode(data));
                    }
                });

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    parser.feed(decoder.decode(value));
                }

                controller.close();
            },
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                Connection: 'keep-alive',
            },
        });
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: 'Server Error', error: error }, { status: 500 })
    }
})