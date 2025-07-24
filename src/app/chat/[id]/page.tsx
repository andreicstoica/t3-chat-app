// In app/chat/[id]/page.tsx
import { api } from "~/trpc/server";
import ChatPageContainer from "~/components/ChatPageContainer";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Fetch everything needed for the page on the server, in parallel.
  const [chatList, currentChat] = await Promise.all([
    api.chat.list(),
    api.chat.get({ chatId: id }),
  ]);

  return (
    <ChatPageContainer
      chats={chatList}
      currentChatId={currentChat.id}
      initialMessages={currentChat.messages ?? []}
    />
  );
}
