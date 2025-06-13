import { redirect } from "next/navigation";
import { createChat } from "~/lib/chat-store";
//import { api } from "~/trpc/server";

export default async function Page() {
  let id: string;

  try {
    id = await createChat(); // create a new chat
  } catch (error) {
    console.log(error);
    redirect("/signin");
  }

  redirect(`/chat/${id}`); // redirect to chat page, see below
}
