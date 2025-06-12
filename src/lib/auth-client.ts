import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: "https://t3-chat-app-ho6w.vercel.app/" // Replace with your production URL
});

export const {
    signIn,
    signUp,
    signOut,
    useSession,
    getSession
} = authClient; 