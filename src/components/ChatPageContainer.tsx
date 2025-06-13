"use client";

import type { Message } from "ai";
import Chat from "./Chat";
import ChatSidebar from "./chat-sidebar";

interface ChatPageContainerProps {
  currentChatId: string;
  initialMessages: Message[];
}

export default function ChatPageContainer({
  currentChatId,
  initialMessages,
}: ChatPageContainerProps) {
  return (
    <div className="flex h-screen">
      <ChatSidebar currentChatId={currentChatId} />
      <Chat id={currentChatId} initialMessages={initialMessages} />
    </div>
  );
}
