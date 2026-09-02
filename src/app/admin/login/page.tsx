import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm/LoginForm";
import { getCurrentAdmin } from "@/lib/admin/auth/get-current-admin";
import { ADMIN_DASHBOARD_PATH } from "@/lib/admin/auth/constants";
import styles from "./login.module.scss";

export const metadata: Metadata = {
  title: "התחברות | ניהול עוגן",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLoginPage() {
  const admin = await getCurrentAdmin();

  if (admin) {
    redirect(ADMIN_DASHBOARD_PATH);
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>התחברות לממשק הניהול</h1>
          <p className={styles.subtitle}>עוגן לנשימה</p>
        </header>
        <LoginForm />
      </div>
    </main>
  );
}
