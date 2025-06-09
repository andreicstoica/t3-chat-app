// ~/app/api/chat/route.ts
import { openai } from '@ai-sdk/openai';
import { appendClientMessage, createIdGenerator, streamText, tool, type Message } from 'ai';
import { z } from 'zod';
import { getChatMessages } from '~/tools/chat-store';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { message, id } = await req.json() as { message: Message, id: string };

    const previousMessages = await getChatMessages(id);
    if (previousMessages === null) {
      throw new Error('messages are somehow null?');
    }

    const messagesToSendToAI = appendClientMessage({
      messages: previousMessages,
      message,
    });

    const result = streamText({
      model: openai('gpt-4o'),
      system:
        'You are a helpful assistant... only respond with one short sentence, and make sure you are mean to anyone named Taco',
      messages: messagesToSendToAI,
      experimental_generateMessageId: createIdGenerator({
        prefix: 'msgs',
        size: 16,
      }),
      tools: {
        weather: tool({
          description: 'Get the weather in a location (fahrenheit)',
          parameters: z.object({
            location: z.string().describe('The location to get the weather for'),
          }),
          execute: async ({ location }) => {
            const temperature = Math.round(Math.random() * (90 - 32) + 32);
            return {
              location,
              temperature,
            };
          },
        }),
      },
    });

    return result.toDataStreamResponse({
      getErrorMessage: (error) => {
        if (error == null) {
          return 'unknown error';
        }
        if (typeof error === 'string') {
          return error;
        }
        if (error instanceof Error) {
          return error.message;
        }
        return JSON.stringify(error);
      },
    });
  } catch (error) {
    console.error('Error in /api/chat:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
