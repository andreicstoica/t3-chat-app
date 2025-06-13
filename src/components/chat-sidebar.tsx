"use client";

import clsx from "clsx";
import Link from "next/link";

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
  return (
    <div className="h-full w-64 overflow-hidden overflow-y-auto border-r">
      {/* TODO add a new chat button here later */}

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
