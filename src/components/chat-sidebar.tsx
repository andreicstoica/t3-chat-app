"use client";

import clsx from "clsx";
import Link from "next/link";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

interface ChatInfo {
  id: string;
  name: string;
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
    <div className="h-full w-64 overflow-hidden overflow-y-auto border-r">
      {/* TODO add a new chat button here later */}
      <Button
        disabled={createChatMutation.isPending}
        onClick={() => createChatMutation.mutate()}
      >
        {createChatMutation.isPending ? "Creating..." : "New Chat"}
      </Button>

      {chats.map((chat) => (
        <Link
          key={chat.id}
          href={`/chat/${chat.id}`}
          className={clsx(
            "block p-4",
            chat.id === currentChatId
              ? "bg-gray-100 font-bold"
              : "hover:bg-gray-100",
          )}
        >
          {chat.name}
        </Link>
      ))}
    </div>
  );
}
