"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  archiveLeadAction,
  updateLeadAction,
} from "@/features/admin/leads/leads.actions";
import {
  AdminActionFeedback,
  AdminConfirmDialog,
  AdminField,
  AdminFormActions,
  AdminSection,
  AdminTextarea,
  useAdminCmsSubmit,
  useAdminFormState,
} from "@/components/admin/forms";
import { LeadStatusBadge } from "@/components/admin/dashboard/LeadStatusBadge/LeadStatusBadge";
import { formatDashboardDate } from "@/lib/admin/dashboard/format-dashboard-date";
import { LEAD_STATUS_LABELS } from "@/lib/admin/dashboard/lead-status";
import type { AdminLead } from "@/types/admin-lead";
import type { LeadStatus } from "@/types/db/persistence";
import formStyles from "@/components/admin/forms/forms.module.scss";
import styles from "./LeadDetailEditor.module.scss";

type LeadFormValues = {
  status: LeadStatus;
  internalNotes: string;
};

type LeadDetailEditorProps = {
  initialLead: AdminLead;
};

const EDITABLE_STATUSES: LeadStatus[] = [
  "NEW",
  "CONTACTED",
  "IN_PROGRESS",
  "CLOSED",
];

function toFormValues(lead: AdminLead): LeadFormValues {
  return {
    status: lead.status === "ARCHIVED" ? "CLOSED" : lead.status,
    internalNotes: lead.internalNotes ?? "",
  };
}

export function LeadDetailEditor({ initialLead }: LeadDetailEditorProps) {
  const router = useRouter();
  const isArchived = initialLead.status === "ARCHIVED";
  const { values, setField, isDirty, resetBaseline } = useAdminFormState(
    toFormValues(initialLead),
  );
  const { state: updateState, submit: submitUpdate, isPending: updatePending } =
    useAdminCmsSubmit(updateLeadAction);
  const {
    state: archiveState,
    submit: submitArchive,
    isPending: archivePending,
  } = useAdminCmsSubmit(archiveLeadAction);
  const [archiveOpen, setArchiveOpen] = useState(false);

  useEffect(() => {
    if (updateState.success) {
      resetBaseline(values);
    }
  }, [updateState.success, resetBaseline, values]);

  useEffect(() => {
    if (archiveState.success) {
      router.push("/admin/leads");
      router.refresh();
    }
  }, [archiveState.success, router]);

  const handleSave = () => {
    submitUpdate({
      leadId: initialLead.id,
      status: values.status,
      internalNotes: values.internalNotes,
    });
  };

  const handleArchive = () => {
    submitArchive({ leadId: initialLead.id });
    setArchiveOpen(false);
  };

  const feedbackError = updateState.error ?? archiveState.error;
  const feedbackSuccess = updateState.success ?? archiveState.success;
  const isPending = updatePending || archivePending;

  return (
    <div className={styles.editor}>
      <Link href="/admin/leads" className={styles.backLink}>
        חזרה לרשימה
      </Link>

      <AdminActionFeedback success={feedbackSuccess} error={feedbackError} />

      <AdminSection title="פרטי הפנייה">
        <dl className={styles.details}>
          <div className={styles.detailRow}>
            <dt>שם</dt>
            <dd>{initialLead.name}</dd>
          </div>
          <div className={styles.detailRow}>
            <dt>טלפון</dt>
            <dd>
              <a href={`tel:${initialLead.phone}`} className={styles.contactLink}>
                {initialLead.phone}
              </a>
            </dd>
          </div>
          <div className={styles.detailRow}>
            <dt>אימייל</dt>
            <dd>
              <a
                href={`mailto:${initialLead.email}`}
                className={styles.contactLink}
              >
                {initialLead.email}
              </a>
            </dd>
          </div>
          <div className={styles.detailRow}>
            <dt>תאריך</dt>
            <dd>{formatDashboardDate(initialLead.createdAt)}</dd>
          </div>
          <div className={styles.detailRow}>
            <dt>סטטוס</dt>
            <dd>
              <LeadStatusBadge status={initialLead.status} />
            </dd>
          </div>
        </dl>

        <div className={styles.messageBlock}>
          <p className={styles.messageLabel}>הודעה</p>
          <p className={styles.messageText}>{initialLead.message}</p>
        </div>
      </AdminSection>

      <AdminSection title="ניהול הפנייה">
        {isArchived ? (
          <p className={styles.archivedNotice}>
            פנייה זו בארכיון. ניתן לצפות בפרטים אך לא לעדכן אותם.
          </p>
        ) : (
          <>
            <AdminField label="סטטוס" htmlFor="lead-status">
              <select
                id="lead-status"
                className={formStyles.input}
                value={values.status}
                onChange={(event) =>
                  setField("status", event.target.value as LeadStatus)
                }
                disabled={isPending}
              >
                {EDITABLE_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {LEAD_STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </AdminField>

            <AdminField label="הערות פנימיות" htmlFor="lead-internal-notes">
              <AdminTextarea
                id="lead-internal-notes"
                value={values.internalNotes}
                onChange={(internalNotes) =>
                  setField("internalNotes", internalNotes)
                }
                disabled={isPending}
                rows={5}
              />
            </AdminField>
          </>
        )}
      </AdminSection>

      {!isArchived ? (
        <>
          <AdminFormActions
            isDirty={isDirty}
            isPending={updatePending}
            onSave={handleSave}
          />

          <div className={styles.archiveActions}>
            <button
              type="button"
              className={styles.archiveButton}
              onClick={() => setArchiveOpen(true)}
              disabled={isPending}
            >
              העברה לארכיון
            </button>
          </div>
        </>
      ) : null}

      <AdminConfirmDialog
        open={archiveOpen}
        title="העברה לארכיון"
        description={`האם להעביר את הפנייה של ${initialLead.name} לארכיון?`}
        confirmLabel="העברה לארכיון"
        cancelLabel="ביטול"
        onConfirm={handleArchive}
        onCancel={() => setArchiveOpen(false)}
        isPending={archivePending}
      />
    </div>
  );
}
