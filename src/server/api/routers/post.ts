import { z } from "zod";

import { desc } from 'drizzle-orm';

import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { posts } from "~/server/db/schema";

export const postRouter = createTRPCRouter({
  hello: protectedProcedure
    .query(({ ctx }) => {
      return {
        greeting: `Hello ${ctx.user.name}`,
      };
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(posts).values({
        name: input.name,
      });
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.query.posts.findFirst({
      orderBy: [desc(posts.createdAt)],
    });

    return post ?? null;
  }),
});