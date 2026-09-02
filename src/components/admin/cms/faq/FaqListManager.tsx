"use client";

import Link from "next/link";
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { FaqItemLeanDocument } from "@/lib/db/repositories/faq-item.repository";
import {
  deleteFaqItemAction,
  reorderFaqItemsAction,
  toggleFaqPublishAction,
} from "@/features/admin/faq/faq.actions";
import { moveItemInOrder } from "@/lib/admin/cms/reorder";
import {
  AdminActionFeedback,
  AdminConfirmDialog,
  AdminToggle,
  useAdminCmsSubmit,
} from "@/components/admin/forms";
import styles from "./FaqListManager.module.scss";

type FaqListManagerProps = {
  initialItems: FaqItemLeanDocument[];
};

export function FaqListManager({ initialItems }: FaqListManagerProps) {
  const [items, setItems] = useState(initialItems);
  const [deleteTarget, setDeleteTarget] = useState<FaqItemLeanDocument | null>(null);
  const { state: reorderState, submit: submitReorder, isPending: reorderPending } =
    useAdminCmsSubmit(reorderFaqItemsAction);
  const { state: toggleState, submit: submitToggle, isPending: togglePending } =
    useAdminCmsSubmit(toggleFaqPublishAction);
  const { state: deleteState, submit: submitDelete, isPending: deletePending } =
    useAdminCmsSubmit(deleteFaqItemAction);

  const feedback = reorderState.error ?? toggleState.error ?? deleteState.error;
  const success =
    reorderState.success ?? toggleState.success ?? deleteState.success;

  const persistOrder = (nextItems: FaqItemLeanDocument[]) => {
    setItems(nextItems);
    submitReorder({ orderedIds: nextItems.map((item) => item.id) });
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const next = moveItemInOrder(items, index, direction);
    if (next !== items) {
      persistOrder(next);
    }
  };

  const handleTogglePublish = (item: FaqItemLeanDocument) => {
    const isPublished = !item.isPublished;
    setItems((current) =>
      current.map((entry) =>
        entry.id === item.id ? { ...entry, isPublished } : entry,
      ),
    );
    submitToggle({ id: item.id, isPublished });
  };

  const handleDelete = () => {
    if (!deleteTarget) {
      return;
    }

    submitDelete({ id: deleteTarget.id });
    setItems((current) => current.filter((item) => item.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const isPending = reorderPending || togglePending || deletePending;

  return (
    <div className={styles.manager}>
      <div className={styles.header}>
        <p className={styles.count}>{items.length} שאלות</p>
        <Link href="/admin/faq/new" className={styles.createLink}>
          <Plus size={16} aria-hidden="true" />
          שאלה חדשה
        </Link>
      </div>

      <AdminActionFeedback success={success} error={feedback} />

      <ul className={styles.list}>
        {items.map((item, index) => (
          <li key={item.id} className={styles.item}>
            <div className={styles.itemHeader}>
              <div>
                <p className={styles.question}>{item.question}</p>
                <span
                  className={
                    item.isPublished ? styles.badgePublished : styles.badgeDraft
                  }
                >
                  {item.isPublished ? "מפורסם" : "טיוטה"}
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
                <Link href={`/admin/faq/${item.id}`} className={styles.iconButton}>
                  <Pencil size={16} aria-label="עריכה" />
                </Link>
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={() => setDeleteTarget(item)}
                  disabled={isPending}
                  aria-label="מחיקה"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <AdminToggle
              id={`faq-publish-${item.id}`}
              label="פרסום"
              checked={item.isPublished}
              onChange={() => handleTogglePublish(item)}
              disabled={isPending}
            />
          </li>
        ))}
      </ul>

      <AdminConfirmDialog
        open={Boolean(deleteTarget)}
        title="מחיקת שאלה"
        description={`האם למחוק את השאלה "${deleteTarget?.question ?? ""}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isPending={deletePending}
      />
    </div>
  );
}
