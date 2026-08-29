import type { ReactNode } from "react";
import { BackgroundDecor } from "@/components/layout/BackgroundDecor";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { getFooterContent } from "@/lib/content/get-footer-content";
import { getMainNav } from "@/lib/content/get-main-nav";
import { getSiteConfig } from "@/lib/content/get-site-config";
import shellStyles from "./layout.module.scss";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [siteConfig, navItems, footerContent] = await Promise.all([
    getSiteConfig(),
    getMainNav(),
    getFooterContent(),
  ]);

  return (
    <div className={shellStyles.shell}>
      <a href="#main-content" className="skipLink">
        דלגי לתוכן
      </a>
      <BackgroundDecor />
      <Navbar navItems={navItems} siteConfig={siteConfig} />
      {children}
      <Footer siteConfig={siteConfig} footerContent={footerContent} />
      <FloatingWhatsApp whatsapp={siteConfig.whatsapp} />
    </div>
  );
}
