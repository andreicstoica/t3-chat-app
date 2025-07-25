"use client";

import { useSession, signOut } from "~/lib/auth-client";
import { Button } from "~/components/ui/button";
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function AuthStatus() {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();

  // Don't show sign in button on the landing page (root path)
  const isLandingPage = pathname === '/';

  if (isPending) {
    return (
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        Loading...
      </div>
    );
  }

  if (!session?.user) {
    // Don't show sign in button on landing page to avoid duplication
    if (isLandingPage) {
      return null;
    }

    return (
      <div className="flex items-center gap-2">
        <Link href="/signin">
          <Button variant="outline" size="sm" className="gap-2">
            Sign in
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium">
        {session.user.name || session.user.email}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={async () => {
          await signOut();
          window.location.href = '/';
        }}
        className="gap-2"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </Button>
    </div>
  );
}
