import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "~/components/theme-provider";
import { AuthStatus } from "~/components/auth-status";

import { TRPCReactProvider } from "~/trpc/react";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "ACS Chat App",
  description: "A template AI chat app to learn NextJS's AI API",
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
              <div className="absolute top-0 left-0 right-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex h-16 items-center justify-between px-4">
                  <h1 className="text-lg font-semibold">ACS Chat App</h1>
                  <AuthStatus />
                </div>
              </div>

              {/* Main Content */}
              <Providers>
                {children}
              </Providers>

              {/* Optional: Auth status at bottom for mobile */}
              <div className="md:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
