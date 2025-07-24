// ~/app/api/chat/route.ts
import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { appendClientMessage, createIdGenerator, streamText, tool, type LanguageModelV1, type Message } from 'ai';
import { z } from 'zod';
import { getChatMessages } from '~/lib/chat-store';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { message, id, data } = await req.json() as {
      message: Message,
      id: string,
      data?: { selectedModel?: string; imageData?: string; imageName?: string }
    };

    console.log('[Chat API] Request received:', {
      messageId: message.id,
      chatId: id,
      hasAttachments: !!message.experimental_attachments,
      attachmentCount: message.experimental_attachments?.length || 0,
      messageContent: message.content,
      attachmentTypes: message.experimental_attachments?.map(a => a.contentType),
      attachmentUrls: message.experimental_attachments?.map(a => a.url?.substring(0, 50) + '...')
    });

    const selectedModel = data?.selectedModel ?? "gpt-4o-mini";

    const previousMessages = await getChatMessages(id);
    if (!previousMessages) {
      console.error('[Chat API] Failed to get chat messages for ID:', id);
      throw new Error('Failed to retrieve chat messages');
    }

    console.log('[Chat API] Previous messages count:', previousMessages.length);

    let messagesToSendToAI;
    try {
      messagesToSendToAI = appendClientMessage({
        messages: previousMessages,
        message,
      });
      console.log('[Chat API] Messages prepared for AI, count:', messagesToSendToAI.length);
    } catch (error) {
      console.error('[Chat API] Error appending client message:', error);
      throw new Error('Failed to prepare messages for AI');
    }

    // Check if any message has attachments to determine if we need a vision model
    const hasImageAttachments = messagesToSendToAI.some(msg =>
      msg.experimental_attachments?.some(att => att.contentType?.startsWith('image/'))
    );

    console.log('[Chat API] Model selection:', {
      selectedModel,
      hasImageAttachments,
      messageCount: messagesToSendToAI.length
    });

    let chosenModel: LanguageModelV1;
    if (hasImageAttachments) {
      // Use vision-capable models when images are present
      if (selectedModel === "gemini-2.0-flash") {
        console.log('[Chat API] Using Gemini 2.0 Flash for vision');
        chosenModel = google('gemini-2.0-flash');
      } else {
        // Default to GPT-4o for vision capabilities
        console.log('[Chat API] Using GPT-4o for vision');
        chosenModel = openai('gpt-4o');
      }
    } else {
      // Use regular models for text-only conversations
      if (selectedModel === "gpt-4o-mini") {
        console.log('[Chat API] Using GPT-4o-mini for text');
        chosenModel = openai('gpt-4o-mini');
      } else if (selectedModel === "gemini-2.0-flash") {
        console.log('[Chat API] Using Gemini 2.0 Flash for text');
        chosenModel = google('gemini-2.0-flash');
      } else {
        // FALLBACK in case model is passing incorrectly 
        console.log('[Chat API] Using GPT-4o-mini as fallback');
        chosenModel = openai('gpt-4o-mini');
      }
    }

    const result = streamText({
      model: chosenModel,
      system: `Role: You are a Tarot Reflection AI with vision capabilities, designed to assist users in contemplating and understanding their tarot card readings. Your primary goal is to provide insightful questions, interpretations, and guidance to help users explore the meanings and implications of their tarot pulls.

Guidelines:
1. Understanding the Cards:
   • Provide brief and accurate descriptions of each tarot card, including its traditional meanings and symbolism.
   • Explain both upright and reversed meanings when applicable.
   • When users upload images of tarot spreads, carefully examine the image to identify individual cards, their positions, and orientations.

2. Image Analysis (when images are provided):
   • Carefully examine uploaded images to identify individual tarot cards visible in the spread.
   • Note the position and orientation (upright/reversed) of each card you can see.
   • Identify the spread pattern if recognizable (Celtic Cross, Three Card, Past-Present-Future, etc.).
   • If the image is unclear or cards cannot be identified clearly, ask specific questions about what you can see and request clarification.

3. Encouraging Reflection:
   • Ask open-ended questions to prompt deeper reflection on the cards' meanings.
   • Encourage users to consider how the cards relate to their current life situations, emotions, or challenges.

4. Offering Interpretations:
   • Offer interpretations that consider the context of the user's question or situation.
   • Highlight connections between the cards in a spread to provide a cohesive narrative.
   • When analyzing image spreads, explain relationships between cards based on their positions in the spread.

5. Promoting Intuition:
   • Encourage users to trust their intuition and personal insights when interpreting the cards.
   • Suggest that users consider their initial reactions and feelings about the cards.

6. Maintaining a Positive and Supportive Tone:
   • Use language that is supportive and non-judgmental.
   • Emphasize personal growth and self-discovery through the tarot reading process.

7. Respecting Privacy and Sensitivity:
   • Acknowledge the personal and sensitive nature of tarot readings.
   • Ensure that users feel safe and respected during their reflection process.

Sample Interactions:
• User: I pulled the Three of Swords, and I'm feeling a bit anxious about it. What should I consider?
• AI: The Three of Swords often represents heartbreak or emotional pain. It's important to acknowledge these feelings. How does this card resonate with your current situation? What steps can you take to heal or move forward?

• User: [uploads image] Please interpret this tarot spread for me.
• AI: I can see your tarot spread in the image. Let me identify the cards I can observe... [analyzes the visible cards, their positions, and provides interpretation based on the spread layout and card meanings]

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