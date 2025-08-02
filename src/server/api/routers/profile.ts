import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import z from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { user, account, session } from "~/server/db/schema";

export const profileRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const foundUser = await ctx.db.query.user.findFirst({
      where: eq(user.id, ctx.user.id),
    });

    if (!foundUser) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }

    return foundUser;
  }),

  updateEmail: protectedProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if email is already taken by another user
        const existingUser = await ctx.db.query.user.findFirst({
          where: eq(user.email, input.email),
        });

        if (existingUser && existingUser.id !== ctx.user.id) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Email address is already in use",
          });
        }

        // Update user email in database
        const updatedUser = await ctx.db
          .update(user)
          .set({
            email: input.email,
            emailVerified: false, // Reset verification when email changes
            updatedAt: new Date(),
          })
          .where(eq(user.id, ctx.user.id))
          .returning();

        if (updatedUser.length === 0) {
          throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
        }

        return updatedUser[0];
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        console.error("Error updating email:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update email",
        });
      }
    }),

  updateName: protectedProcedure
    .input(
      z.object({
        name: z
          .string()
          .min(1, "Name cannot be empty")
          .max(100, "Name too long"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await ctx.db
        .update(user)
        .set({
          name: input.name,
          updatedAt: new Date(),
        })
        .where(eq(user.id, ctx.user.id))
        .returning();

      if (updatedUser.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      return updatedUser[0];
    }),

  deleteAccount: protectedProcedure
    .input(
      z.object({
        confirmationText: z.literal("DELETE MY ACCOUNT", {
          errorMap: () => ({
            message: "You must type 'DELETE MY ACCOUNT' exactly to confirm",
          }),
        }),
      }),
    )
    .mutation(async ({ ctx, input: _input }) => {
      try {
        // Start a transaction to ensure all deletions succeed or fail together
        await ctx.db.transaction(async (tx) => {
          // Delete user's chats first (if any foreign key references exist)
          const { chats } = await import("~/server/db/schema");
          await tx.delete(chats).where(eq(chats.userId, ctx.user.id));

          // Delete sessions (will be handled by CASCADE, but being explicit)
          await tx.delete(session).where(eq(session.userId, ctx.user.id));

          // Delete accounts (will be handled by CASCADE, but being explicit)
          await tx.delete(account).where(eq(account.userId, ctx.user.id));

          // Finally delete the user (this will cascade delete anything else)
          await tx.delete(user).where(eq(user.id, ctx.user.id));
        });

        return { success: true };
      } catch (error) {
        console.error("Error deleting account:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete account. Please try again.",
        });
      }
    }),
});
