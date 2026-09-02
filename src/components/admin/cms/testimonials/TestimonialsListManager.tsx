"use client";

import Link from "next/link";
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { TestimonialLeanDocument } from "@/lib/db/repositories/testimonial.repository";
import {
  deleteTestimonialAction,
  reorderTestimonialsAction,
  toggleTestimonialPublishAction,
} from "@/features/admin/testimonials/testimonials.actions";
import { moveItemInOrder } from "@/lib/admin/cms/reorder";
import {
  AdminActionFeedback,
  AdminConfirmDialog,
  AdminToggle,
  useAdminCmsSubmit,
} from "@/components/admin/forms";
import styles from "./TestimonialsListManager.module.scss";

type TestimonialsListManagerProps = {
  initialItems: TestimonialLeanDocument[];
};

export function TestimonialsListManager({
  initialItems,
}: TestimonialsListManagerProps) {
  const [items, setItems] = useState(initialItems);
  const [deleteTarget, setDeleteTarget] = useState<TestimonialLeanDocument | null>(
    null,
  );
  const { state: reorderState, submit: submitReorder, isPending: reorderPending } =
    useAdminCmsSubmit(reorderTestimonialsAction);
  const { state: toggleState, submit: submitToggle, isPending: togglePending } =
    useAdminCmsSubmit(toggleTestimonialPublishAction);
  const { state: deleteState, submit: submitDelete, isPending: deletePending } =
    useAdminCmsSubmit(deleteTestimonialAction);

  const feedback = reorderState.error ?? toggleState.error ?? deleteState.error;
  const success =
    reorderState.success ?? toggleState.success ?? deleteState.success;

  const persistOrder = (nextItems: TestimonialLeanDocument[]) => {
    setItems(nextItems);
    submitReorder({
      orderedMongoIds: nextItems.map((item) => String(item._id)),
    });
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const next = moveItemInOrder(items, index, direction);
    if (next !== items) {
      persistOrder(next);
    }
  };

  const handleTogglePublish = (item: TestimonialLeanDocument) => {
    const mongoId = String(item._id);
    const isPublished = !item.isPublished;
    setItems((current) =>
      current.map((entry) =>
        String(entry._id) === mongoId ? { ...entry, isPublished } : entry,
      ),
    );
    submitToggle({ mongoId, isPublished });
  };

  const handleDelete = () => {
    if (!deleteTarget) {
      return;
    }

    const mongoId = String(deleteTarget._id);
    submitDelete({ mongoId });
    setItems((current) => current.filter((item) => String(item._id) !== mongoId));
    setDeleteTarget(null);
  };

  const isPending = reorderPending || togglePending || deletePending;

  return (
    <div className={styles.manager}>
      <div className={styles.header}>
        <p className={styles.count}>{items.length} המלצות</p>
        <Link href="/admin/testimonials/new" className={styles.createLink}>
          <Plus size={16} aria-hidden="true" />
          המלצה חדשה
        </Link>
      </div>

      <AdminActionFeedback success={success} error={feedback} />

      <ul className={styles.list}>
        {items.map((item, index) => {
          const mongoId = String(item._id);

          return (
            <li key={mongoId} className={styles.item}>
              <div className={styles.itemHeader}>
                <div>
                  <p className={styles.quote}>{item.quote}</p>
                  {item.name ? <p className={styles.meta}>{item.name}</p> : null}
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
                  <Link
                    href={`/admin/testimonials/${mongoId}`}
                    className={styles.iconButton}
                  >
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
                id={`testimonial-publish-${mongoId}`}
                label="פרסום"
                checked={item.isPublished}
                onChange={() => handleTogglePublish(item)}
                disabled={isPending}
              />
            </li>
          );
        })}
      </ul>

      <AdminConfirmDialog
        open={Boolean(deleteTarget)}
        title="מחיקת המלצה"
        description="האם למחוק את ההמלצה? פעולה זו אינה ניתנת לביטול."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isPending={deletePending}
      />
    </div>
  );
}
