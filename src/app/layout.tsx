import type { ReactNode } from "react";
import { Assistant } from "next/font/google";
import { buildRootMetadata } from "@/lib/seo/metadata";
import "./globals.scss";

const assistant = Assistant({
  subsets: ["hebrew", "latin"],
  variable: "--font-assistant",
  display: "swap",
});

export const metadata = buildRootMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={assistant.variable}>
      <body>
        {/* Analytics inject point — Phase N */}
        {children}
      </body>
    </html>
  );
}
