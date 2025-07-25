import "~/styles/globals.css";
import logo from "~/../public/logo.png";
import Image from "next/image";

import { TRPCReactProvider } from "~/trpc/react";
import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { Cinzel, Crimson_Text } from "next/font/google";
import { ThemeProvider } from "~/components/theme-provider";
import { Toaster } from "~/components/ui/sonner";

import { ConditionalHeader } from "~/components/conditional-header";

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

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "500", "600", "700"],
});

const crimsonText = Crimson_Text({
  subsets: ["latin"],
  variable: "--font-crimson",
  weight: ["400", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${cinzel.variable} ${crimsonText.variable}`} suppressHydrationWarning>
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
              <ConditionalHeader />

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
