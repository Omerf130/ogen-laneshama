import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Assistant } from "next/font/google";
import { getSiteConfig } from "@/lib/content/get-site-config";
import { getSiteDefaultSeo } from "@/lib/content/get-site-default-seo";
import { buildRootMetadata } from "@/lib/seo/metadata";
import "./globals.scss";

const assistant = Assistant({
  subsets: ["hebrew", "latin"],
  variable: "--font-assistant",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const [siteConfig, resolvedSeo] = await Promise.all([
    getSiteConfig(),
    getSiteDefaultSeo(),
  ]);

  return buildRootMetadata(siteConfig, resolvedSeo);
}

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
