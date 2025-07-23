import "~/styles/globals.css";
import logo from "~/../public/logo.png";
import Image from "next/image";

import { TRPCReactProvider } from "~/trpc/react";
import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "~/components/theme-provider";
import { Toaster } from "~/components/ui/sonner";

import { AuthStatus } from "~/components/auth-status";

export const metadata: Metadata = {
  title: "Daily Tarot",
  description: "Helping people reflect on their draws",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`} suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCReactProvider>
            <div className="flex h-screen min-h-0 flex-col overflow-hidden">
              {/* Auth Status Bar at the top */}
              <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 border-b backdrop-blur">
                <div className="flex h-16 items-center justify-between px-4">
                  <Image src={logo} alt="logo" width={50} height={50} />
                  <AuthStatus />
                </div>
              </div>

              <main className="min-h-0 flex-1 overflow-hidden">
                {/* Main Content */}
                {children}
                <Toaster />
              </main>
            </div>
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
