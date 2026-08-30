"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { buildWhatsAppUrl } from "@/lib/whatsapp/build-whatsapp-url";
import logoImage from "@/pics/WhatsApp_Image_2026-08-30_at_21.17.23-removebg-preview.png";
import type { NavItem } from "@/types/navigation";
import type { SiteConfig } from "@/types/content";
import styles from "./Navbar.module.scss";

interface NavbarProps {
  navItems: NavItem[];
  siteConfig: SiteConfig;
}

function isActiveLink(href: string, pathname: string): boolean {
  if (href.startsWith("/#")) {
    return pathname === "/";
  }

  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}

export function Navbar({ navItems, siteConfig }: NavbarProps) {
  const pathname = usePathname();
  const menuId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const whatsAppUrl = buildWhatsAppUrl(
    siteConfig.whatsapp.number,
    siteConfig.whatsapp.message,
  );

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const openMenu = useCallback(() => {
    setIsMenuOpen(true);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const onPopState = () => {
      setIsMenuOpen(false);
    };

    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    const firstFocusable = panelRef.current?.querySelector<HTMLElement>(
      "a, button",
    );
    firstFocusable?.focus();

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isMenuOpen, closeMenu]);

  return (
    <>
      <header
        className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}
      >
        <Container>
          <div className={styles.inner}>
            <Link href="/" className={styles.logo}>
              <Image
                src={logoImage}
                alt={siteConfig.businessName}
                className={styles.logoImage}
                priority
              />
            </Link>

            <nav className={styles.desktopNav} aria-label="ניווט ראשי">
              <ul className={styles.navList}>
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`${styles.navLink} ${
                        isActiveLink(item.href, pathname) ? styles.active : ""
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className={styles.actions}>
              {whatsAppUrl ? (
                <Button
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  className={styles.desktopCta}
                >
                  דברי איתי
                </Button>
              ) : null}

              <button
                type="button"
                className={styles.menuToggle}
                aria-expanded={isMenuOpen}
                aria-controls={menuId}
                aria-label={isMenuOpen ? "סגירת תפריט" : "פתיחת תפריט"}
                onClick={isMenuOpen ? closeMenu : openMenu}
              >
                {isMenuOpen ? "✕" : "☰"}
              </button>
            </div>
          </div>
        </Container>
      </header>

      <div
        className={`${styles.overlay} ${isMenuOpen ? styles.open : ""}`}
        onClick={closeMenu}
        aria-hidden={!isMenuOpen}
      />

      <div
        ref={panelRef}
        id={menuId}
        role="dialog"
        aria-modal="true"
        aria-label="תפריט ניווט"
        className={`${styles.panel} ${isMenuOpen ? styles.open : ""}`}
        hidden={!isMenuOpen}
      >
        <div className={styles.panelHeader}>
          <Link href="/" className={styles.panelLogo} onClick={closeMenu}>
            <Image
              src={logoImage}
              alt={siteConfig.businessName}
              className={styles.logoImage}
            />
          </Link>
          <button
            type="button"
            className={styles.closeButton}
            aria-label="סגירת תפריט"
            onClick={closeMenu}
          >
            ✕
          </button>
        </div>

        <nav aria-label="ניווט נייד">
          <ul className={styles.mobileNavList}>
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`${styles.mobileNavLink} ${
                    isActiveLink(item.href, pathname) ? styles.active : ""
                  }`}
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {whatsAppUrl ? (
          <Button
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.mobileCta}
            onClick={closeMenu}
          >
            דברי איתי
          </Button>
        ) : null}
      </div>
    </>
  );
}
