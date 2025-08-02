import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { SettingsPageContent } from "~/components/settings-page";
import { auth } from "~/lib/auth";

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <div className="bg-background fixed inset-0 overflow-y-auto">
      <div className="container mx-auto max-w-4xl p-6 pb-20">
        <SettingsPageContent user={session.user} />
      </div>
    </div>
  );
}
