"use client";

import { useCallback, useEffect, useId, useState, type ReactNode } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar/AdminSidebar";
import type { AdminIdentity } from "@/types/admin";
import styles from "./AdminShell.module.scss";

type AdminShellProps = {
  admin: AdminIdentity;
  children: ReactNode;
};

export function AdminShell({ admin, children }: AdminShellProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mobileNavId = useId();

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((open) => !open);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeMenu, isMenuOpen]);

  return (
    <div className={styles.shell}>
      <aside className={styles.desktopSidebar} aria-label="סרגל צד">
        <AdminSidebar />
      </aside>

      <div className={styles.main}>
        <AdminHeader
          admin={admin}
          menuControlsId={mobileNavId}
          onMenuToggle={toggleMenu}
          isMenuOpen={isMenuOpen}
        />

        <div className={styles.content}>{children}</div>
      </div>

      {isMenuOpen ? (
        <button
          type="button"
          className={styles.backdrop}
          aria-label="סגור תפריט"
          onClick={closeMenu}
        />
      ) : null}

      <aside
        id={mobileNavId}
        className={isMenuOpen ? styles.mobileSidebarOpen : styles.mobileSidebar}
        aria-hidden={!isMenuOpen}
      >
        <AdminSidebar onNavigate={closeMenu} />
      </aside>
    </div>
  );
}
