import { generateId, type Message } from 'ai';
import { db } from '~/server/db';
import { chats } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

export async function createChat(): Promise<string> {
const id = generateId(); // generate a unique chat ID
  console.log(`[createChat] Attempting to create new chat with ID: ${id}`);
  console.log(`[createChat] Chat name: New chat id: ${id}`);
  try {
    // Adding .returning({ id: chats.id }) here too is helpful for debugging
    const insertedRows = await db.insert(chats).values({
      id: id,
      name: `New chat id: ${id}`,
      // messages column will default to []
    }).returning({ id: chats.id }); // <--- Add .returning() here too!

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
    // You might want to re-throw or handle the error to prevent redirection to a non-existent chat
    throw error;
  }
}

export async function getChatMessages(id: string): Promise<Message[] > {
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
        console.log(`[saveChatMessages] Successfully updated chat ID: ${id}. Updated rows count: ${updatedRows.length}`);
        console.log(`[saveChatMessages] Updated chat ID: ${updatedRows[0]?.id}`); // Log the ID of the first updated row
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