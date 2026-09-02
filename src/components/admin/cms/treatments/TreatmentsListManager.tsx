"use client";

import Link from "next/link";
import { ChevronDown, ChevronUp, Pencil } from "lucide-react";
import { useState } from "react";
import type { TreatmentLeanDocument } from "@/lib/db/repositories/treatment.repository";
import {
  reorderTreatmentsAction,
  setTreatmentActiveAction,
} from "@/features/admin/treatments/treatments.actions";
import { moveItemInOrder } from "@/lib/admin/cms/reorder";
import {
  AdminActionFeedback,
  AdminToggle,
  useAdminCmsSubmit,
} from "@/components/admin/forms";
import styles from "./TreatmentsListManager.module.scss";

type TreatmentsListManagerProps = {
  initialItems: TreatmentLeanDocument[];
};

export function TreatmentsListManager({
  initialItems,
}: TreatmentsListManagerProps) {
  const [items, setItems] = useState(initialItems);
  const { state: reorderState, submit: submitReorder, isPending: reorderPending } =
    useAdminCmsSubmit(reorderTreatmentsAction);
  const { state: activeState, submit: submitActive, isPending: activePending } =
    useAdminCmsSubmit(setTreatmentActiveAction);

  const feedback = reorderState.error ?? activeState.error;
  const success = reorderState.success ?? activeState.success;
  const isPending = reorderPending || activePending;

  const persistOrder = (nextItems: TreatmentLeanDocument[]) => {
    setItems(nextItems);
    submitReorder({ orderedSlugs: nextItems.map((item) => item.slug) });
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const next = moveItemInOrder(items, index, direction);
    if (next !== items) {
      persistOrder(next);
    }
  };

  const handleToggleActive = (item: TreatmentLeanDocument) => {
    const isActive = !item.isActive;
    setItems((current) =>
      current.map((entry) =>
        entry.slug === item.slug ? { ...entry, isActive } : entry,
      ),
    );
    submitActive({ slug: item.slug, isActive });
  };

  return (
    <div className={styles.manager}>
      <AdminActionFeedback success={success} error={feedback} />

      <ul className={styles.list}>
        {items.map((item, index) => (
          <li key={item.slug} className={styles.item}>
            <div className={styles.itemHeader}>
              <div>
                <p className={styles.title}>{item.title}</p>
                <p className={styles.slug}>{item.slug}</p>
                <span
                  className={item.isActive ? styles.badgeActive : styles.badgeInactive}
                >
                  {item.isActive ? "פעיל" : "לא פעיל"}
                </span>
              </div>
              <div className={styles.itemActions}>
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={() => moveItem(index, -1)}
                  disabled={index === 0 || isPending}
                  aria-label="הזז למעלה"
                >
                  <ChevronUp size={16} />
                </button>
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={() => moveItem(index, 1)}
                  disabled={index === items.length - 1 || isPending}
                  aria-label="הזז למטה"
                >
                  <ChevronDown size={16} />
                </button>
                <Link
                  href={`/admin/treatments/${item.slug}`}
                  className={styles.iconButton}
                >
                  <Pencil size={16} aria-label="עריכה" />
                </Link>
              </div>
            </div>
            <AdminToggle
              id={`treatment-active-${item.slug}`}
              label="טיפול פעיל באתר"
              checked={item.isActive}
              onChange={() => handleToggleActive(item)}
              disabled={isPending}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
