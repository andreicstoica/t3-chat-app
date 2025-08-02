import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "~/server/db"; // your drizzle instance
import { env } from "~/env";

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,

  trustedOrigins: [
    "http://localhost:3000",
    "https://t3-chat-app-ho6w.vercel.app",
  ],

  socialProviders:
    env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {},

  database: drizzleAdapter(db, {
    provider: "pg",
  }),

  emailAndPassword: {
    enabled: true,
  },

  plugins: [nextCookies()],
});
