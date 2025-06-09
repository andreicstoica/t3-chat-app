//import Link from "next/link";
//import { LatestPost } from "~/app/_components/post";
import { api, HydrateClient } from "~/trpc/server";
import Chat from "../components/ui/chat";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  console.log(hello);

  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <main>
        <Chat />
      </main>
    </HydrateClient>
  );
}
