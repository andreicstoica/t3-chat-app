// app/api/save-chat/route.ts
import { saveChatMessages } from '~/lib/chat-store';
import type { Message } from 'ai';

export const maxDuration = 10;

export async function POST(req: Request) {
  try {
    // Expects { id: string, messages: Message[] }
    const { id, messages } = (await req.json()) as {
      id: string;
      messages: Message[];
    };

    if (!id || !messages) {
      return new Response('Chat ID and messages are required', { status: 400 });
    }

    await saveChatMessages({ id, messages });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('[SaveChat API] Failed to save chat messages:', error);
    return new Response('Failed to save chat messages', { status: 500 });
  }
}