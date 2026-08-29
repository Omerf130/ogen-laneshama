import type { ReactNode } from "react";
import { buildRootMetadata } from "@/lib/seo/metadata";
import "./globals.scss";

export const metadata = buildRootMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body>
        {/* Analytics inject point — Phase N */}
        {children}
      </body>
    </html>
  );
}
