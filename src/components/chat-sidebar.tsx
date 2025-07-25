"use client";

import clsx from "clsx";
import Link from "next/link";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { api, type RouterOutputs } from "~/trpc/react";
import { Trash2 } from "lucide-react";
import { useState } from "react";

type ChatList = RouterOutputs["chat"]["list"];

export default function ChatSidebar({
  chats: initialChats,
  currentChatId,
}: {
  chats: ChatList;
  currentChatId: string;
}) {
  const router = useRouter();
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null);
  const [deletingChatId, setDeletingChatId] = useState<string | null>(null);
  const utils = api.useUtils();

  // Use client-side query that will automatically update when invalidated
  const { data: chats = [] } = api.chat.list.useQuery(undefined, {
    initialData: initialChats,
  });

  // 1. Set up the mutation hook BEFORE the return statement
  const createChatMutation = api.chat.create.useMutation({
    onSuccess: (newChatId) => {
      router.push(`/chat/${newChatId}`);
    },
  });

  const deleteChatMutation = api.chat.delete.useMutation({
    onSuccess: (_, variables) => {
      // Clear the deleting state
      setDeletingChatId(null);

      // Invalidate and refetch chat list
      void utils.chat.list.invalidate();

      // If we deleted the current chat, redirect to home
      // The AuthRedirect component will handle creating a new chat if needed
      if (variables.chatId === currentChatId) {
        router.push('/');
      }
    },
    onError: () => {
      // Clear the deleting state on error
      setDeletingChatId(null);
    },
  });

  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling

    if (confirm('Are you sure you want to delete this chat?')) {
      setDeletingChatId(chatId);
      deleteChatMutation.mutate({ chatId });
    }
  };

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
        {chats.map((chat) => {
          const isDeleting = deletingChatId === chat.id;

          return (
            <div
              key={chat.id}
              className={clsx(
                "relative group transition-all duration-300 ease-in-out",
                isDeleting && "opacity-50 scale-95 pointer-events-none"
              )}
              onMouseEnter={() => !isDeleting && setHoveredChatId(chat.id)}
              onMouseLeave={() => setHoveredChatId(null)}
            >
              <Link
                href={`/chat/${chat.id}`}
                className={clsx(
                  "block p-4 border-b border-border/50 transition-colors relative",
                  chat.id === currentChatId
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  isDeleting && "pointer-events-none"
                )}
              >
                <div className="relative overflow-hidden pr-8">
                  <div className="truncate text-sm">
                    {(() => {
                      const date = new Date(chat.createdAt);
                      const month = date.getMonth() + 1;
                      const day = date.getDate();
                      const message = chat.lastMessage ?? "New conversation";
                      return `${month}/${day} ${message}`;
                    })()}
                  </div>
                  <div className={clsx(
                    "absolute inset-y-0 right-8 w-8 bg-gradient-to-l to-transparent",
                    chat.id === currentChatId
                      ? "from-accent"
                      : "from-background group-hover:from-muted"
                  )} />
                </div>

                {/* Loading overlay */}
                {isDeleting && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  </div>
                )}
              </Link>

              {/* Delete Button */}
              {hoveredChatId === chat.id && !isDeleting && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
                  onClick={(e) => handleDeleteChat(e, chat.id)}
                  disabled={deleteChatMutation.isPending}
                  title="Delete chat"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
