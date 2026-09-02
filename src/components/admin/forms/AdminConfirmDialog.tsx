"use client";

import { useEffect, useRef } from "react";
import styles from "./forms.module.scss";

type AdminConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isPending?: boolean;
};

export function AdminConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "מחיקה",
  cancelLabel = "ביטול",
  onConfirm,
  onCancel,
  isPending,
}: AdminConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      cancelRef.current?.focus();
    }
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className={styles.dialogBackdrop} role="presentation" onClick={onCancel}>
      <div
        className={styles.dialog}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="admin-confirm-title"
        aria-describedby="admin-confirm-body"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="admin-confirm-title" className={styles.dialogTitle}>
          {title}
        </h2>
        <p id="admin-confirm-body" className={styles.dialogBody}>
          {description}
        </p>
        <div className={styles.dialogActions}>
          <button
            ref={cancelRef}
            type="button"
            className={styles.secondaryButton}
            onClick={onCancel}
            disabled={isPending}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={styles.dangerButton}
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? "מוחק..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
