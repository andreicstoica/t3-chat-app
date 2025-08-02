import "~/styles/globals.css";

import { TRPCReactProvider } from "~/trpc/react";
import { type Metadata } from "next";
import { STIX_Two_Text } from "next/font/google";
import { ThemeProvider } from "~/components/theme-provider";
import { Toaster } from "~/components/ui/sonner";
import { ModelProvider } from "~/lib/model-context";

export const metadata: Metadata = {
  title: "Daily Tarot",
  description: "Helping people reflect on their draws",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

const stixTwoText = STIX_Two_Text({
  subsets: ["latin"],
  variable: "--font-stix-two-text",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${stixTwoText.variable}`}
      suppressHydrationWarning
    >
      <head />
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCReactProvider>
            <ModelProvider>
              <div className="flex h-screen min-h-0 flex-col overflow-hidden">
                <main className="min-h-0 flex-1 overflow-hidden">
                  {/* Main Content */}
                  {children}
                  <Toaster />
                </main>
              </div>
            </ModelProvider>
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
