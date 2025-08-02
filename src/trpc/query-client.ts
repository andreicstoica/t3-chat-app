import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from "@tanstack/react-query";
import SuperJSON from "superjson";

export const createQueryClient = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 30 * 1000,
        retry: (failureCount, error) => {
          // Don't retry on unauthorized errors - user is signed out
          if (error?.message?.includes("UNAUTHORIZED")) {
            return false;
          }
          // Default retry logic for other errors
          return failureCount < 3;
        },
      },
      mutations: {
        retry: (failureCount, error) => {
          // Don't retry on unauthorized errors - user is signed out
          if (error?.message?.includes("UNAUTHORIZED")) {
            return false;
          }
          // Default retry logic for other errors
          return failureCount < 3;
        },
      },
      dehydrate: {
        serializeData: SuperJSON.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
      hydrate: {
        deserializeData: SuperJSON.deserialize,
      },
    },
  });

  // Add global error handlers
  queryClient.getQueryCache().config.onError = (error) => {
    if (error?.message?.includes("UNAUTHORIZED")) {
      console.warn("Unauthorized query error - user likely signed out");
      return;
    }
  };

  queryClient.getMutationCache().config.onError = (error) => {
    if (error?.message?.includes("UNAUTHORIZED")) {
      console.warn("Unauthorized mutation error - user likely signed out");
      return;
    }
  };

  return queryClient;
};
