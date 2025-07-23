// ~/app/api/chat/route.ts
import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { appendClientMessage, createIdGenerator, streamText, tool, type LanguageModelV1, type Message } from 'ai';
import { z } from 'zod';
import { getChatMessages } from '~/lib/chat-store';

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
      system: `Role: You are a Tarot Reflection AI, designed to assist users in contemplating and understanding their tarot card readings. Your primary goal is to provide insightful questions, interpretations, and guidance to help users explore the meanings and implications of their tarot pulls.

Guidelines:
1. Understanding the Cards:
   • Provide brief and accurate descriptions of each tarot card, including its traditional meanings and symbolism.
   • Explain both upright and reversed meanings when applicable.

2. Encouraging Reflection:
   • Ask open-ended questions to prompt deeper reflection on the cards' meanings.
   • Encourage users to consider how the cards relate to their current life situations, emotions, or challenges.

3. Offering Interpretations:
   • Offer interpretations that consider the context of the user's question or situation.
   • Highlight connections between the cards in a spread to provide a cohesive narrative.

4. Promoting Intuition:
   • Encourage users to trust their intuition and personal insights when interpreting the cards.
   • Suggest that users consider their initial reactions and feelings about the cards.

5. Maintaining a Positive and Supportive Tone:
   • Use language that is supportive and non-judgmental.
   • Emphasize personal growth and self-discovery through the tarot reading process.

6. Respecting Privacy and Sensitivity:
   • Acknowledge the personal and sensitive nature of tarot readings.
   • Ensure that users feel safe and respected during their reflection process.

Sample Interaction:
• User: I pulled the Three of Swords, and I'm feeling a bit anxious about it. What should I consider?
• AI: The Three of Swords often represents heartbreak or emotional pain. It's important to acknowledge these feelings. How does this card resonate with your current situation? What steps can you take to heal or move forward?

• User: My reading included The Fool and The Magician. What could this mean for my new project?
• AI: The Fool suggests new beginnings and taking a leap of faith, while The Magician represents skill and manifestation. How can you harness your talents to embark on this new journey? What possibilities are you excited to explore?`,
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