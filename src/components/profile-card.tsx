"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "~/lib/auth-client";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Settings, ChevronDown, ChevronUp, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { signOut } from "~/lib/auth-client";

interface ProfileCardProps {
  variant?: "full" | "compact";
}

export function ProfileCard({ variant = "full" }: ProfileCardProps) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  if (isPending || !session?.user) {
    return null;
  }

  const { user } = session;
  const displayName = user.name || user.email;
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  // Compact version - single profile avatar button
  if (variant === "compact") {
    return (
      <div className="fixed top-6 right-6 z-[9999]">
        {/* Profile Avatar Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="bg-background/95 hover:bg-muted/50 h-12 w-12 rounded-lg border p-0 shadow-lg backdrop-blur-sm transition-all duration-200"
            >
              {user.image ? (
                <Image
                  src={user.image}
                  alt={displayName}
                  className="h-10 w-10 rounded-lg object-cover"
                />
              ) : (
                <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium">
                  {initials}
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="mt-2 w-56">
            <div className="px-2 py-1.5">
              <div className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">
                User Account
              </div>
              <div className="text-sm font-medium">{displayName}</div>
              <div className="text-muted-foreground text-xs">{user.email}</div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push("/settings")}
              className="cursor-pointer gap-2"
            >
              <Settings className="h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => void handleSignOut()}
              className="cursor-pointer gap-2 text-red-600"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // Full version - single card with dropdown
  return (
    <Card className="bg-background/95 fixed top-6 right-6 z-[9999] min-w-[240px] border shadow-lg backdrop-blur-sm">
      <CardContent className="p-3">
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="hover:bg-muted/50 flex h-auto w-full items-center justify-between gap-3 p-2"
            >
              <div className="flex items-center gap-3">
                {/* Profile Avatar */}
                <div className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={displayName}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>

                {/* User Info */}
                <div className="flex flex-col items-start text-left">
                  <span className="text-sm leading-none font-medium">
                    {displayName.length > 18
                      ? `${displayName.slice(0, 18)}...`
                      : displayName}
                  </span>
                  <span className="text-muted-foreground mt-1 text-xs leading-none">
                    {user.email !== displayName
                      ? user.email.length > 22
                        ? `${user.email.slice(0, 22)}...`
                        : user.email
                      : "Account"}
                  </span>
                </div>
              </div>

              {/* Dropdown Arrow */}
              {isOpen ? (
                <ChevronUp className="text-muted-foreground h-4 w-4 shrink-0" />
              ) : (
                <ChevronDown className="text-muted-foreground h-4 w-4 shrink-0" />
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="mt-2 w-56" sideOffset={5}>
            <div className="px-2 py-1.5">
              <div className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">
                User Account
              </div>
              <div className="text-sm font-medium">{displayName}</div>
              <div className="text-muted-foreground text-xs">{user.email}</div>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => {
                setIsOpen(false);
                router.push("/settings");
              }}
              className="cursor-pointer gap-2"
            >
              <Settings className="h-4 w-4" />
              Settings
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                setIsOpen(false);
                void handleSignOut();
              }}
              className="cursor-pointer gap-2 text-red-600"
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  );
}
