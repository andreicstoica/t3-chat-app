import { createAuthClient } from "better-auth/react";

// Get the base URL from environment or use localhost for development
const getBaseURL = () => {
  // In production, use the environment variable
  if (process.env.NEXT_PUBLIC_AUTH_URL) {
    return process.env.NEXT_PUBLIC_AUTH_URL;
  }

  // For development, always use localhost
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  // In browser, use window.location.origin as fallback
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // Final fallback
  return "http://localhost:3000";
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;
