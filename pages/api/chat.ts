// pages/api/yourroute.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { constructPrompt, generateConversationTitle, getOllamaResponse } from '@/lib/ollama';
import { config } from '@/config';
import { apiPagesMiddleware } from '@/app/api/middleware';
import { AuthenticatedSession, TOllamaResponse } from '@/types';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

interface TBody {
  message: string;
  user_id: string;
  conversation_id: string;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // const session = await auth(req, res)
  /** 
   *  NOTES : get session data is bug in authjs v5 beta, for this keep running
   * pass the user_id from frontend (by req.body)
   * */
  // if (!session || !session.user) {
  //   return res.status(401).json({ message: 'Unauthorized' })
  // }

  if (req.method !== 'POST') {
    res.status(405).end('Method Not Allowed');
    return;
  }

  const { message, conversation_id, user_id }: TBody = req.body;
  if (!user_id || !conversation_id || !message) {
    return res.status(404).json({
      message: 'all field is required'
    })
  }
  let conversation = await prisma.conversation.findFirst({
    where: {
      user_id,
      uuid: conversation_id
    },
    include: { Message: true }
  })
  if (!conversation) {
    res.status(404).json({ message: 'conversation not found' })
    return
  }
  const lastMessage = conversation.Message[conversation.Message.length - 1]
  let isFirst = false
  if (lastMessage.role == 'user' && lastMessage.content == message) {
    isFirst = true
  }
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  const fullPrompt = constructPrompt(message, []);

  try {
    const response = await fetch(config.OLLAMA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.OLLAMA_MODEL,
        prompt: fullPrompt,
        stream: true,
      }),
    });

    if (!response.body) {
      res.write('event: error\ndata: Failed to connect to external stream\n\n');
      res.end();
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    // Read stream and pipe chunks to client
    let buffer = ''
    const afterDone = async () => {
      const insertData = []
      if (!isFirst) {
        insertData.push({
          role: 'user',
          conversation_id: conversation.id,
          content: message,
        })
      }
      insertData.push({
        role: 'assistant',
        conversation_id: conversation.id,
        content: buffer
      })
      await prisma.message.createMany({
        data: insertData as Prisma.MessageCreateManyInput | Prisma.MessageCreateManyInput[]
      })
      if (!conversation.title || conversation.title == 'New Title') {
        const title = await generateConversationTitle(message, buffer)
        await prisma.conversation.update({
          where: { id: conversation.id },
          data: {
            title
          }
        })
      }
    }
    const read = async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          try {
            const jsonChunk: TOllamaResponse = JSON.parse(chunk.trim())
            buffer += jsonChunk.response
          } catch (error) {
            console.error('failed to parse', error)
          }
          res.write(`data: ${chunk.trim()}\n\n`);
        }
        // done streaming
        afterDone()
      } catch (err) {
        console.error('Error reading upstream stream:', err);
      } finally {
        res.end();
      }
    };

    read();
    req.on('close', () => {
      afterDone()
      res.end();
    });

  } catch (error) {
    console.error('Error fetching Ollama API:', error);
    res.write('event: error\ndata: Internal server error\n\n');
    res.end();
  }
}