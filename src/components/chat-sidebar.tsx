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

  // Set up the mutation hook
  const createChatMutation = api.chat.create.useMutation({
    onSuccess: (newChatId) => {
      router.push(`/chat/${newChatId}`);
    },
  });

  const deleteChatMutation = api.chat.delete.useMutation({
    onSuccess: (_, variables) => {
      // Clear the deleting state
      setDeletingChatId(null);

      // If we deleted the current chat, navigate to the next available chat
      if (variables.chatId === currentChatId) {
        const remainingChats = chats.filter(
          (chat) => chat.id !== variables.chatId,
        );

        if (remainingChats.length > 0) {
          // Find the current chat's index to determine the next chat
          const currentIndex = chats.findIndex(
            (chat) => chat.id === currentChatId,
          );
          let nextChat;

          if (currentIndex < remainingChats.length) {
            // If there's a chat after the current one, use it
            nextChat = remainingChats[currentIndex];
          } else {
            // Otherwise, use the previous chat (or the first one)
            nextChat = remainingChats[Math.max(0, currentIndex - 1)];
          }

          if (nextChat) {
            router.push(`/chat/${nextChat.id}`);
          }
        } else {
          // No chats left, go to home
          router.push("/");
        }
      }

      // Invalidate and refetch chat list after navigation
      void utils.chat.list.invalidate();
    },
    onError: () => {
      // Clear the deleting state on error
      setDeletingChatId(null);
    },
  });

  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling

    if (confirm("Are you sure you want to delete this chat?")) {
      setDeletingChatId(chatId);
      deleteChatMutation.mutate({ chatId });
    }
  };

  return (
    <div className="bg-background flex h-full w-64 flex-col overflow-hidden border-r">
      {/* New Chat Button */}
      <div className="border-b p-4">
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
        <div className="text-muted-foreground p-4 pb-2 text-xs font-medium tracking-wide uppercase">
          Recent Chats
        </div>
        {chats.map((chat) => {
          const isDeleting = deletingChatId === chat.id;

          return (
            <div
              key={chat.id}
              className={clsx(
                "group relative transition-all duration-300 ease-in-out",
                isDeleting && "pointer-events-none scale-95 opacity-50",
              )}
              onMouseEnter={() => !isDeleting && setHoveredChatId(chat.id)}
              onMouseLeave={() => setHoveredChatId(null)}
            >
              <Link
                href={`/chat/${chat.id}`}
                className={clsx(
                  "border-border/50 relative block border-b p-4 transition-colors",
                  chat.id === currentChatId
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  isDeleting && "pointer-events-none",
                )}
              >
                <div className="pr-8">
                  <div className="truncate text-sm">
                    {(() => {
                      const date = new Date(chat.createdAt);
                      const month = date.getMonth() + 1;
                      const day = date.getDate();
                      const message = chat.lastMessage ?? "New conversation";
                      return `${month}/${day} ${message}`;
                    })()}
                  </div>
                </div>

                {/* Loading overlay */}
                {isDeleting && (
                  <div className="bg-background/80 absolute inset-0 flex items-center justify-center">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  </div>
                )}
              </Link>

              {/* Delete Button */}
              {hoveredChatId === chat.id && !isDeleting && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-destructive absolute top-1/2 right-2 h-6 w-6 -translate-y-1/2 p-0 opacity-0 transition-opacity group-hover:opacity-100 hover:text-white"
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
