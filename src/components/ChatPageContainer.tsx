"use client";

import type { Message } from "ai";
import Chat from "./Chat";
import { type ChatsProps } from "./chat-sidebar";
import ChatSidebar from "./chat-sidebar";

interface ChatPageContainerProps {
  chats: ChatsProps[];
  currentChatId: string;
  initialMessages: Message[];
}

export default function ChatPageContainer({
  chats,
  currentChatId,
  initialMessages,
}: ChatPageContainerProps) {
  return (
    <div className="flex h-screen">
      <ChatSidebar chats={chats} />
      <Chat id={currentChatId} initialMessages={initialMessages} />
    </div>
  );
}
