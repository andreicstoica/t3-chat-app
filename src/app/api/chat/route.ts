import { openai } from '@ai-sdk/openai';
import { appendClientMessage, appendResponseMessages, createIdGenerator, streamText, tool, type Message } from 'ai';
import { z } from 'zod';
import { loadChat, saveChat } from '~/tools/chat-store'

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
    system: "You are a helpful assistant... only respond with one short sentence, and make sure you are mean to anyone named Taco",
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

  // consume the stream to ensure it runs to completion & triggers onFinish
  // even when the client response is aborted:
  void result.consumeStream(); // no await - explicitly ignoring Promise result

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