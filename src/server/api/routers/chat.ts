import { TRPCError } from '@trpc/server';
import { desc, eq } from 'drizzle-orm';
import z from 'zod';
import { createChat } from '~/lib/chat-store';

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { chats } from "~/server/db/schema";

export const chatRouter = createTRPCRouter({

  list: protectedProcedure
    .query(async ({ ctx } ) => {
    // getting user session
    const userId = ctx.user.id;

    // find user chat history in db
    const foundChats = await ctx.db.query.chats.findMany({
      where: eq(chats.userId, userId),
      orderBy: [desc(chats.createdAt)],
    });
    return foundChats ?? null;
  }),

  get: protectedProcedure
    .input(z.object({ chatId: z.string() }))
    .query(async ({ ctx, input }) => {

      const foundChat = await ctx.db.query.chats.findFirst({
        where: eq(chats.id, input.chatId)
      })

      if (!foundChat || foundChat.userId !== ctx.user.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" })
      }

      return foundChat
    }),

  create: protectedProcedure
    .mutation(async ({ ctx }) => {
      const newChatId = await createChat({
        userId: ctx.user.id,
      })

      return newChatId
    })
});