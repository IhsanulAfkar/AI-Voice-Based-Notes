import { Color, Note, Prisma } from "@prisma/client";
import { apiMiddleware } from "../middleware";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
type TBody = {
    color?: Color,
    content: string
    messageId: number
}

