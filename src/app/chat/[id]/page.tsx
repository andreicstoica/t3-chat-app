import { getChatMessages } from "~/tools/chat-store";
import Chat from "~/components/Chat";
import { headers } from "next/headers";
import { auth } from "~/lib/auth";
import { redirect } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params; // get the chat ID from the URL
  const messages = await getChatMessages(id); // load the chat messages

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  console.log("Session:", session);

  if (!session?.user) {
    console.log("User not authenticated, redirecting to login");
    redirect("/login");
  }

  return <Chat id={id} initialMessages={messages} />; // display the chat
}
