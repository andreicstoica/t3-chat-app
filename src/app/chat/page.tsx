import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { api } from "~/trpc/server";
import { auth } from "~/lib/auth";

export default async function ChatRootPage() {
  // Check if user is authenticated first
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    // Redirect to home if not authenticated
    redirect("/");
  }

  // For now, just create a new chat to get the basic flow working
  // We can improve this later to show existing chats
  const newChatId = await api.chat.create();
  redirect(`/chat/${newChatId}`);
}
