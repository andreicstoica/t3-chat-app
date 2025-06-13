"use client";

import type { Message } from "ai";
import Chat from "./Chat";
import ChatSidebar from "./chat-sidebar";
import { type RouterOutputs } from "~/trpc/react";
type ChatList = RouterOutputs["chat"]["list"];

interface ChatPageContainerProps {
  chats: ChatList;
  currentChatId: string;
  initialMessages: Message[];
}

export default function ChatPageContainer({
  chats,
  currentChatId,
  initialMessages,
}: ChatPageContainerProps) {
  return (
    <div className="flex h-full border-2 border-red-500">
      <ChatSidebar chats={chats} currentChatId={currentChatId} />
      <Chat id={currentChatId} initialMessages={initialMessages} />
    </div>
  );
}
