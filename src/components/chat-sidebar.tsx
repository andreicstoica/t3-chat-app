"use client";

import clsx from "clsx";
import Link from "next/link";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

interface ChatInfo {
  id: string;
  name: string;
  lastMessage?: string;
  createdAt: Date | string;
}

export default function ChatSidebar({
  chats,
  currentChatId,
}: {
  chats: ChatInfo[];
  currentChatId: string;
}) {
  const router = useRouter();

  // 1. Set up the mutation hook BEFORE the return statement
  const createChatMutation = api.chat.create.useMutation({
    onSuccess: async (newChatId) => {
      await router.push(`/chat/${newChatId}`);
    },
  });

  return (
    <div className="flex h-full w-64 flex-col overflow-hidden border-r bg-background">
      {/* New Chat Button */}
      <div className="p-4 border-b">
        <Button
          disabled={createChatMutation.isPending}
          onClick={() => createChatMutation.mutate()}
          className="w-full"
          variant="default"
        >
          {createChatMutation.isPending ? "Creating..." : "New Chat"}
        </Button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <Link
            key={chat.id}
            href={`/chat/${chat.id}`}
            className={clsx(
              "block p-4 border-b border-border/50 transition-colors",
              chat.id === currentChatId
                ? "bg-accent text-accent-foreground font-medium"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <div className="relative overflow-hidden">
              <div className="truncate text-sm">
                {(() => {
                  const date = new Date(chat.createdAt);
                  const month = date.getMonth() + 1;
                  const day = date.getDate();
                  const message = chat.lastMessage || "New conversation";
                  return `${month}/${day} ${message}`;
                })()}
              </div>
              <div className={clsx(
                "absolute inset-y-0 right-0 w-8 bg-gradient-to-l to-transparent",
                chat.id === currentChatId
                  ? "from-accent"
                  : "from-background"
              )} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
