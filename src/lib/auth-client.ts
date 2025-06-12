import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: process.env.NODE_ENV === "production"
        ? "https://your-domain.com" // Replace with your production URL
        : "http://localhost:3000"
});

export const {
    signIn,
    signUp,
    signOut,
    useSession,
    getSession
} = authClient; 