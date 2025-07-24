"use client";

import { useSession, signOut } from "~/lib/auth-client";
import { Button } from "~/components/ui/button";
import { LogOut, User } from "lucide-react";
import Link from "next/link";

export function AuthStatus() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        Loading...
      </div>
    );
  }

  if (!session?.user) {
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
      <div className="flex items-center gap-2 text-sm">
        <User className="h-4 w-4" />
        <span className="text-muted-foreground">Welcome,</span>
        <span className="font-medium">
          {session.user.name || session.user.email}
        </span>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => signOut()}
        className="gap-2"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </Button>
    </div>
  );
}
