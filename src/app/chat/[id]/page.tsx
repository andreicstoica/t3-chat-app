import { getChatMessages } from "~/lib/chat-store";
import ChatPageContainer from "~/components/ChatPageContainer";
import { api } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { data: chats, isLoading } = api.chat.list.useQuery();
  const { id } = await props.params; // get the chat ID from the URL
  const messages = await getChatMessages(id); // load the chat messages
  return (
    <ChatPageContainer
      chats={chats}
      currentChatId={id}
      initialMessages={messages ?? []}
    />
  ); // display the chat
}
