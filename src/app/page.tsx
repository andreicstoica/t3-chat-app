import { redirect } from "next/navigation";
import { auth } from "~/lib/auth";
import { headers } from "next/headers";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (session?.user) {
    redirect("/chat");
  }

  // If not authenticated, redirect to sign in
  redirect("/signin");
}
