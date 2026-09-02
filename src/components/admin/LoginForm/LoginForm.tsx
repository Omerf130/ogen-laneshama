"use client";

import { useActionState } from "react";
import {
  loginAction,
  type LoginActionState,
} from "@/features/admin/auth/login.action";
import styles from "./LoginForm.module.scss";

const initialState: LoginActionState = {};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );

  return (
    <form className={styles.form} action={formAction} noValidate>
      <div className={styles.field}>
        <label htmlFor="admin-email" className={styles.label}>
          דוא&quot;ל
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={styles.input}
          disabled={isPending}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="admin-password" className={styles.label}>
          סיסמה
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={styles.input}
          disabled={isPending}
        />
      </div>

      {state.error ? (
        <p className={styles.error} role="alert">
          {state.error}
        </p>
      ) : null}

      <button type="submit" className={styles.submit} disabled={isPending}>
        {isPending ? "מתחבר..." : "התחברות"}
      </button>
    </form>
  );
}
