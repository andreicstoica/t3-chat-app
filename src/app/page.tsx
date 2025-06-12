import { cookies } from "next/headers";
import Link from "next/link";
import { Logout } from "~/components/logout";

export default async function Page() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("better-auth.session_token");

  return (
    <div className="flex justify-end">
      {sessionCookie ? <Logout /> : <Link href="/signin">Login</Link>}
    </div>
  );

  //return <Home />;
}
