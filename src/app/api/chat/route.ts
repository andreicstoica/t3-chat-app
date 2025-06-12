// ~/app/api/chat/route.ts
import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { appendClientMessage, createIdGenerator, streamText, tool, type LanguageModelV1, type Message } from 'ai';
import { z } from 'zod';
import { getChatMessages } from '~/tools/chat-store';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { message, id, selectedModel } = await req.json() as { message: Message, id: string, selectedModel: string };

    const previousMessages = await getChatMessages(id);
    if (previousMessages === null) {
      throw new Error('messages are somehow null?');
    }

    const messagesToSendToAI = appendClientMessage({
      messages: previousMessages,
      message,
    });

    let chosenModel: LanguageModelV1;
    if (selectedModel === "gpt-4o-mini") {
      chosenModel = openai('gpt-4o-mini');
    } else if (selectedModel === "gemini-2.0-flash") {
      chosenModel = google('gemini-2.0-flash');
    } else {
      // FALLBACK in case model is passing incorrectly 
      chosenModel = openai('gpt-4o-mini');
    }

    const result = streamText({
      model: chosenModel,
      system:
        "You are a helpful assistant. Be succinct and to the point. Be really nice to anyone named Lily. Help her reflect on her tarot readings, especially when trends emerge over time!",
      messages: messagesToSendToAI,
      experimental_generateMessageId: createIdGenerator({
        prefix: 'msgs',
        size: 16,
      }),
      onError: (error) => console.log(error),
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
