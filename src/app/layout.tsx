import type { Metadata } from "next";
import "./globals.css";
import UIProvider from "@/providers/UIProvider";
import { ClerkProvider } from "@clerk/nextjs";
import LayoutProvider from "@/providers/LayoutProvider";

export const metadata: Metadata = {
  title: "JUC QANdA Next App",
  description: "JUC QANDA Forum by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <UIProvider>
            <LayoutProvider>{children}</LayoutProvider>
          </UIProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
