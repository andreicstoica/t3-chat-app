"use client";

import { useSession, signIn, signOut } from "~/lib/auth-client";
import { Button } from "~/components/ui/button";
import { LogIn, LogOut, User, Github } from "lucide-react";

export function AuthStatus() {
    const { data: session, isPending } = useSession();

    if (isPending) {
        return (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Loading...
            </div>
        );
    }

    if (!session?.user) {
        return (
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => signIn.social({ provider: "github" })}
                    className="gap-2"
                >
                    <Github className="h-4 w-4" />
                    Sign in with GitHub
                </Button>
                <span className="text-muted-foreground mx-2">or</span>
                <form
                    className="flex flex-col gap-2 w-full max-w-xs"
                >
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                        autoComplete="email"
                        className="input input-bordered rounded-md px-3 py-2 border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                        autoComplete="current-password"
                        className="input input-bordered rounded-md px-3 py-2 border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button type="submit" variant="default" className="w-full gap-2">
                        <LogIn className="h-4 w-4" />
                        Sign in with Email
                    </Button>
                </form>
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