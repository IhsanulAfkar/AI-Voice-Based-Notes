// pages/api/yourroute.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { constructPrompt } from '@/lib/ollama';
import { config } from '@/config';

interface TBody {
  message: string;
  conversation_id?: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).end('Method Not Allowed');
    return;
  }

  const { message, conversation_id }: TBody = req.body;

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  const fullPrompt = constructPrompt(message, []);
  console.log(fullPrompt);

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
    const read = async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          res.write(`data: ${chunk.trim()}\n\n`);
        }
      } catch (err) {
        console.error('Error reading upstream stream:', err);
      } finally {
        res.end();
      }
    };

    read();

    // Close stream if client disconnects
    req.on('close', () => {
      console.log('Client disconnected');
      res.end();
    });

  } catch (error) {
    console.error('Error fetching Ollama API:', error);
    res.write('event: error\ndata: Internal server error\n\n');
    res.end();
  }
}
