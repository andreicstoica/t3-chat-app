"use client";

import type { Message } from "ai";
import Chat from "./Chat";
import ChatSidebar from "./chat-sidebar";
import { ProfileCard } from "./profile-card";
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
    <>
      <div className="flex h-full min-h-0 overflow-hidden">
        <ChatSidebar chats={chats} currentChatId={currentChatId} />
        <Chat id={currentChatId} initialMessages={initialMessages} />
      </div>
      {/* Floating profile card positioned absolutely */}
      <ProfileCard variant="compact" />
    </>
  );
}
