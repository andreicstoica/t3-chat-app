import { redirect } from "next/navigation";
import { api } from "~/trpc/server";

export default async function ChatRootPage() {
  // For now, just create a new chat to get the basic flow working
  // We can improve this later to show existing chats
  const newChatId = await api.chat.create();
  redirect(`/chat/${newChatId}`);
}
