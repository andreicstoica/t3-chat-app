"use client";

import { redirect } from "next/navigation";
import { api } from "~/trpc/react"; // <-- Use the client-side API boject here for error handling
import { Button } from "~/components/ui/button";

export function NewChatButton() {
  const createChatMutation = api.chat.create.useMutation({
    onSuccess: (newChatId) => {
      // After the chat is created successfully, navigate to its page
      redirect(`/chat/${newChatId}`);
    },
    onError: (error) => {
      // Handle any errors, ex: a toast notification
      console.error("Failed to create chat:", error);
    },
  });

  const handleCreateChat = () => {
    createChatMutation.mutate();
  };

  return (
    <Button onClick={handleCreateChat} disabled={createChatMutation.isPending}>
      {createChatMutation.isPending ? "Creating..." : "New Chat"}
    </Button>
  );
}
