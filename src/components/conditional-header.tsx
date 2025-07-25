"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import logo from "~/../public/logo.png";
import { AuthStatus } from "~/components/auth-status";

export function ConditionalHeader() {
    const pathname = usePathname();

    // Don't show header on landing page, sign in, or sign up pages
    const hideHeader = pathname === '/' || pathname === '/signin' || pathname === '/signup';

    if (hideHeader) {
        return null;
    }

    return (
        <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur border-b">
            <div className="flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-3">
                    <div className="golden-glow squircle p-2">
                        <Image src={logo} alt="logo" width={32} height={32} />
                    </div>
                    <span className="font-display text-lg font-semibold mystical-text">Daily Tarot</span>
                </div>
                <AuthStatus />
            </div>
        </div>
    );
}