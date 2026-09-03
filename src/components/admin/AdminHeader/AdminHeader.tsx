"use client";

import { logoutAction } from "@/features/admin/auth/logout.action";
import type { AdminIdentity } from "@/types/admin";
import styles from "./AdminHeader.module.scss";

type AdminHeaderProps = {
  admin: AdminIdentity;
  menuControlsId?: string;
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
};

export function AdminHeader({
  admin,
  menuControlsId,
  onMenuToggle,
  isMenuOpen = false,
}: AdminHeaderProps) {
  const displayName = admin.name ?? admin.email;

  return (
    <header className={styles.header}>
      <div className={styles.start}>
        {onMenuToggle ? (
          <button
            type="button"
            className={styles.menuButton}
            aria-expanded={isMenuOpen}
            aria-controls={menuControlsId}
            aria-label={isMenuOpen ? "סגור תפריט" : "פתח תפריט"}
            onClick={onMenuToggle}
            suppressHydrationWarning
          >
            <span className={styles.menuIcon} aria-hidden="true" />
          </button>
        ) : null}
        <div className={styles.identity}>
          <span className={styles.name}>{displayName}</span>
          {admin.name ? (
            <span className={styles.email}>{admin.email}</span>
          ) : null}
        </div>
      </div>

      <form action={logoutAction}>
        <button type="submit" className={styles.logoutButton} suppressHydrationWarning>
          התנתקות
        </button>
      </form>
    </header>
  );
}
