import { getChatMessages } from "~/lib/chat-store";
import Chat from "~/components/Chat";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params; // get the chat ID from the URL
  const messages = await getChatMessages(id); // load the chat messages
  return <Chat id={id} initialMessages={messages} />; // display the chat
}
