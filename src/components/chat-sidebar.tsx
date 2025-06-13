"use client";

import clsx from "clsx";
import Link from "next/link";
import { chatRouter } from "~/server/api/routers/chat";

export default function ChatSidebar(currentChatId: string) {
  const chats = chatRouter.list.useQuery();

  return (
    <div className="h-full w-64 overflow-y-auto border-r">
      {chats.map((chat) => (
        <Link
          key={chat.id}
          href={`/chat/${chat.id}`}
          className={clsx(
            "block p-4",
            chat.id === currentChatId
              ? "bg-gray-100 font-bold"
              : "bg-gray-400 hover:bg-gray-100",
          )}
        >
          {chat.name}
        </Link>
      ))}
    </div>
  );
}
