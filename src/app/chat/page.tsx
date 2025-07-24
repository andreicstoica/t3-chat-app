import { redirect } from "next/navigation";
import { api } from "~/trpc/server"; // Use the server-side helper!!!

export default async function ChatRootPage() {
  const newChatId = await api.chat.create();
  redirect(`/chat/${newChatId}`);
}
