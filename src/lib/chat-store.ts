import { generateId, type Message } from 'ai';
import { db } from '~/server/db';
import { chats } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

export function getLastMessageContent(message: Message): string {
  if (!message) return "";

  try {
    // Handle different message formats

    // First try the content property (common format)
    if (message.content && typeof message.content === 'string') {
      return message.content;
    }

    // Then try parts array (newer format)
    if (message.parts && Array.isArray(message.parts)) {
      const textPart = message.parts.find(part => part.type === "text");
      if (textPart && "text" in textPart) {
        return textPart.text;
      }
    }

    // Fallback: check if content is an array
    if (Array.isArray(message.content)) {
      const textContent = message.content.find(item =>
        typeof item === 'string' || (item && typeof item === 'object' && 'text' in item)
      );
      if (typeof textContent === 'string') {
        return textContent;
      }
      if (textContent && typeof textContent === 'object' && 'text' in textContent) {
        return (textContent as { text: string }).text;
      }
    }

  } catch (error) {
    console.error("Error extracting message content:", error);
  }

  return "";
}
//import { auth } from "~/lib/auth";
//import { headers } from 'next/headers';

export async function createChat({ userId }: { userId: string; }): Promise<string> {
  const id = generateId(); // generate a unique chat ID
  console.log(`[createChat] Attempting to create new chat with ID: ${id}`);
  console.log(`[createChat] Chat name: New conversation`);

  /*
  const userSession = await auth.api.getSession({
    headers: await headers()
  });

  if (!userSession) {
    throw new Error('no userSession')
  }

  if (!userId) {
    throw new Error('no userId')
  }
  */

  try {
    const insertedRows = await db.insert(chats).values({
      id: id,
      userId: userId,
      name: `New conversation`,
      // messages column will default to []
    }).returning({ id: chats.id });

    if (insertedRows.length > 0) {
      console.log(`[createChat] Successfully created chat ID: ${insertedRows[0]?.id}`);
      return id;
    } else {
      // This case should ideally not happen for a successful insert
      console.error(`[createChat] Insert operation returned no rows, but no error occurred. ID: ${id}`);
      throw new Error('Failed to create chat in DB (no rows inserted).');
    }
  } catch (error) {
    console.error(`[createChat] Error creating chat with ID ${id}:`, error);
    throw error;
  }
}

export async function getChatMessages(id: string): Promise<Message[]> {
  const chatRecord = await db.query.chats.findFirst({
    where: eq(chats.id, id),
    columns: {
      messages: true,
    },
  });

  // return null if the chat messages don't exist
  return chatRecord?.messages ?? [];
}

export async function saveChatMessages({
  id,
  messages,
}: {
  id: string;
  messages: Message[];
}): Promise<void> {
  try {
    const updatedRows = await db
      .update(chats)
      .set({ messages: messages })
      .where(eq(chats.id, id))
      .returning({ id: chats.id }); // This makes updatedRows an array [{ id: '...' }]

    console.log(`[saveChatMessages] Drizzle update result (updated rows array):`, updatedRows);

    // Check the length of the array to see if any rows were updated
    if (updatedRows.length === 0) {
      console.warn(`[saveChatMessages] No rows updated for chat ID: ${id}. Does it exist in the DB?`);
    } else {

    }
  } catch (error) {
    console.error(`[saveChatMessages] Error during Drizzle update for chat ID ${id}:`, error);
  }
}

// in case i want to get whole chat obj
export async function getChat(id: string) {
  return db.query.chats.findFirst({
    where: eq(chats.id, id)
  })
}