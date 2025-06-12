"use client";

import { redirect } from "next/navigation";
import { authClient } from "~/lib/auth-client";
import { Button } from "~/components/ui/button";

export default async function Home() {
  //TODO need to work on this later -> make sure that the session is authenticated properly
  // and then pass the context down to chat. currently this runs every 2/3 ms! :D
  /*
  if ((await authClient.getSession()).data?.session.userId) {
    return redirect("/chat");
  }
    */

  // if not auth, signin/signup
  return (
    <div className="flex flex-row gap-1">
      <Button onClick={() => redirect("/signin")}>Sign In</Button>
      <Button onClick={() => redirect("/signup")}>Sign Up</Button>
    </div>
  );
}
