"use client";

import { useSession } from "~/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LandingPage } from "./landing-page";

export function AuthRedirect() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && session?.user) {
      router.push("/chat");
    }
  }, [session, isPending, router]);

  // Show loading while checking auth
  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent" />
      </div>
    );
  }

  // Show landing page if not authenticated
  if (!session?.user) {
    return <LandingPage />;
  }

  // Show loading while redirecting
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent" />
    </div>
  );
}
