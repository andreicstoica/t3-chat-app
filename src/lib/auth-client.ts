import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: process.env.NODE_ENV === "production"
        ? "https://t3-chat-app-ho6w.vercel.app/" // Replace with your production URL
        : "http://localhost:3000"
});

export const {
    signIn,
    signUp,
    signOut,
    useSession,
    getSession
} = authClient; 