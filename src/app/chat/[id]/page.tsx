// In app/chat/[id]/page.tsx
import { api } from "~/trpc/server";
import ChatPageContainer from "~/components/ChatPageContainer";

export default async function Page({ params }: { params: { id: string } }) {
  // Fetch everything needed for the page on the server, in parallel.
  const [chatList, currentChat] = await Promise.all([
    api.chat.list(),
    api.chat.get({ chatId: params.id }),
  ]);

  return (
    <ChatPageContainer
      chats={chatList}
      currentChatId={currentChat.id}
      initialMessages={currentChat.messages ?? []}
    />
  );
}
