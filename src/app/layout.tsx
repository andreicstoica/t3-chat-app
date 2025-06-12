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
  icons: [{ rel: "icon", url: "/favicon.ico" }],
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
            {/* Auth Status Bar at the top */}
            <div className="h-screen max-h-screen">
              <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 absolute top-0 right-0 left-0 border-b backdrop-blur">
                <div className="flex h-16 items-center justify-between px-4">
                  <Image src={logo} alt="logo" width={50} height={50} />
                  <AuthStatus />
                </div>
              </div>

              {/* Main Content */}
              {children}
              <Toaster />

              {/* Optional: Auth status at bottom for mobile */}
              <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 border-t backdrop-blur md:hidden">
                <div className="container flex h-12 items-center justify-center px-4">
                  <AuthStatus />
                </div>
              </div>
            </div>
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
