import { NextResponse } from "next/server"
import { apiMiddleware } from "../middleware"
import { prisma } from "@/lib/prisma"
import { randomUUID } from "crypto";
import path from "path";
import { mkdir, writeFile } from "fs/promises";
import { existsSync } from "fs";
import { Conversation } from "@prisma/client";

export const POST = apiMiddleware(async (req, session) => {
    try {
        const formData = await req.formData();
        const file = formData.get('audio') as File;
        const conversation_id = formData.get('conversation_id') as string
        let conversation: Conversation | null = null
        if (!conversation_id) {
            conversation = await prisma.conversation.create({
                data: {
                    user_id: session.user.id!,
                    title: 'New Title',
                }
            })
        } else {
            conversation = await prisma.conversation.findFirst({
                where: {
                    user_id: session.user.id,
                    uuid: conversation_id
                }
            })
            if (!conversation)
                return NextResponse.json({ message: "Conversation not found" }, { status: 404 })
        }

        if (!file) {
            return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = path.join(process.cwd(), 'public', 'uploads');

        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        const filename = `${randomUUID()}.webm`;
        const filePath = path.join(uploadDir, filename);

        await writeFile(filePath, buffer);

        // extract 

        return NextResponse.json({ message: 'Upload successful', url: `/uploads/${filename}` });
    } catch (error) {
        console.error(error)
        return NextResponse.json({
            message: "Server Error"
        }, { status: 500 });
    }
})