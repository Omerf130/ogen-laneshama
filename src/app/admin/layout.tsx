import type { ReactNode } from "react";
import type { Metadata } from "next";
import styles from "./admin-layout.module.scss";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.adminRoot} dir="rtl" lang="he">
      {children}
    </div>
  );
}
