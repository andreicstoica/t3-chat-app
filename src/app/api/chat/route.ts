import { openai } from '@ai-sdk/openai';
import { appendClientMessage, appendResponseMessages, createIdGenerator, streamText, tool } from 'ai';
import type { Message } from 'ai';
import { z } from 'zod';
import { saveChat } from '~/tools/chat-store';
import { loadChat } from '~/tools/chat-store';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { message, id } = await req.json() as { message: Message, id: string };

  const previousMessages = await loadChat(id);

  const messages = appendClientMessage({
    messages: previousMessages,
    message,
  });

  const result = streamText({
    model: openai('gpt-4o'),
    // id format for server-side messages:
    experimental_generateMessageId: createIdGenerator({
      prefix: 'msgs',
      size: 16,
    }),
    messages,
    async onFinish({ response }) {
      await saveChat({
        id,
        messages: appendResponseMessages({
          messages,
          responseMessages: response.messages,
        }),
      });
    },
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

  void result.consumeStream(); // no await (added void bc of tool usage i think)

  return result.toDataStreamResponse({
    getErrorMessage: error => {
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
}