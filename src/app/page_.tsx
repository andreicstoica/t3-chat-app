import { redirect } from "next/navigation";

export default async function Page() {
  redirect(`/chat`); // redirect to chat page, see below
}
