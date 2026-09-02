"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavSections } from "@/components/admin/nav-config";
import styles from "./AdminSidebar.module.scss";

type AdminSidebarProps = {
  id?: string;
  className?: string;
  onNavigate?: () => void;
};

export function AdminSidebar({
  id,
  className,
  onNavigate,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const rootClassName = [styles.sidebar, className].filter(Boolean).join(" ");

  return (
    <nav
      id={id}
      className={rootClassName}
      aria-label="ניווט ניהול"
    >
      <div className={styles.brand}>
        <span className={styles.brandTitle}>עוגן</span>
        <span className={styles.brandSubtitle}>ממשק ניהול</span>
      </div>

      {adminNavSections.map((section, sectionIndex) => (
        <div key={section.title ?? `section-${sectionIndex}`} className={styles.section}>
          {section.title ? (
            <p className={styles.sectionTitle}>{section.title}</p>
          ) : null}
          <ul className={styles.list}>
            {section.items.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={isActive ? styles.linkActive : styles.link}
                    aria-current={isActive ? "page" : undefined}
                    onClick={onNavigate}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
