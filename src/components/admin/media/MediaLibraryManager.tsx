"use client";

import { upload } from "@vercel/blob/client";
import { Check, Pencil, Trash2, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import {
  AdminActionFeedback,
  AdminConfirmDialog,
  AdminField,
} from "@/components/admin/forms";
import {
  deleteMediaAssetAction,
  registerMediaAssetAction,
  updateMediaAltAction,
} from "@/features/admin/media/media.actions";
import type { AdminMediaLibraryItem } from "@/lib/admin/media/loaders";
import { ADMIN_MEDIA_UPLOAD_URL } from "@/lib/admin/media/constants";
import {
  extensionFromFile,
  formatUploadBytes,
  validateImageFile,
} from "@/lib/admin/media/upload-image-client";
import {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_IMAGE_UPLOAD_BYTES,
  VERCEL_BLOB_PROVIDER,
} from "@/lib/validation/admin-phase7";
import formStyles from "@/components/admin/forms/forms.module.scss";
import styles from "./MediaLibraryManager.module.scss";

type MediaLibraryManagerProps = {
  initialAssets: AdminMediaLibraryItem[];
};

type DeleteDialogState =
  | { kind: "confirm"; asset: AdminMediaLibraryItem }
  | { kind: "blocked"; asset: AdminMediaLibraryItem; message: string }
  | null;

type AssetOverrides = {
  removedIds: Set<string>;
  updatedById: Map<string, AdminMediaLibraryItem>;
  added: AdminMediaLibraryItem[];
};

function providerLabel(provider: string): string {
  if (provider === VERCEL_BLOB_PROVIDER) {
    return "ענן";
  }

  return "מקומי";
}

function getDeleteBlockedMessage(asset: AdminMediaLibraryItem): string | null {
  if (asset.isLocal) {
    return "תמונות מקומיות (מהזרע) לא ניתנות למחיקה.";
  }

  if (asset.referenceLabels.length > 0) {
    return `התמונה בשימוש: ${asset.referenceLabels.join(", ")}`;
  }

  return null;
}

function applyAssetOverrides(
  initialAssets: AdminMediaLibraryItem[],
  overrides: AssetOverrides,
): AdminMediaLibraryItem[] {
  const base = initialAssets
    .filter((asset) => !overrides.removedIds.has(asset._id))
    .map((asset) => overrides.updatedById.get(asset._id) ?? asset);

  return [...overrides.added, ...base];
}

export function MediaLibraryManager({ initialAssets }: MediaLibraryManagerProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [overrides, setOverrides] = useState<AssetOverrides>({
    removedIds: new Set(),
    updatedById: new Map(),
    added: [],
  });
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>(null);
  const [editingAltId, setEditingAltId] = useState<string | null>(null);
  const [draftAlt, setDraftAlt] = useState("");
  const [uploadAlt, setUploadAlt] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [feedback, setFeedback] = useState<{ success?: string; error?: string }>({});
  const [isBusy, setIsBusy] = useState(false);

  const assets = useMemo(
    () => applyAssetOverrides(initialAssets, overrides),
    [initialAssets, overrides],
  );

  const resetUploadPanel = () => {
    setUploadAlt("");
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const startAltEdit = (asset: AdminMediaLibraryItem) => {
    setEditingAltId(asset._id);
    setDraftAlt(asset.alt);
  };

  const cancelAltEdit = () => {
    setEditingAltId(null);
    setDraftAlt("");
  };

  const saveAlt = async (asset: AdminMediaLibraryItem) => {
    const nextAlt = draftAlt.trim();

    if (!nextAlt || nextAlt === asset.alt) {
      cancelAltEdit();
      return;
    }

    setIsBusy(true);
    setFeedback({});

    const formData = new FormData();
    formData.set("payload", JSON.stringify({ mediaId: asset._id, alt: nextAlt }));
    const result = await updateMediaAltAction({}, formData);

    if (!result.success) {
      setFeedback({ error: result.error });
      setIsBusy(false);
      return;
    }

    setOverrides((current) => {
      const updatedById = new Map(current.updatedById);
      updatedById.set(asset._id, { ...asset, alt: nextAlt });

      return { ...current, updatedById };
    });
    setFeedback({ success: result.success });
    cancelAltEdit();
    setIsBusy(false);
  };

  const handleDeleteClick = (asset: AdminMediaLibraryItem) => {
    const blockedMessage = getDeleteBlockedMessage(asset);

    if (blockedMessage) {
      setDeleteDialog({ kind: "blocked", asset, message: blockedMessage });
      return;
    }

    setDeleteDialog({ kind: "confirm", asset });
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog?.kind !== "confirm") {
      return;
    }

    const asset = deleteDialog.asset;
    setIsBusy(true);
    setFeedback({});

    const formData = new FormData();
    formData.set("payload", JSON.stringify({ mediaId: asset._id }));
    const result = await deleteMediaAssetAction({}, formData);

    if (!result.success) {
      setFeedback({ error: result.error });
      setIsBusy(false);
      return;
    }

    setOverrides((current) => {
      const removedIds = new Set(current.removedIds);
      removedIds.add(asset._id);

      return {
        ...current,
        removedIds,
        added: current.added.filter((entry) => entry._id !== asset._id),
      };
    });
    setDeleteDialog(null);
    setFeedback({ success: result.success });
    setIsBusy(false);
  };

  const handleUpload = async () => {
    setFeedback({});

    if (!selectedFile) {
      setFeedback({ error: "יש לבחור קובץ תמונה." });
      return;
    }

    const validationError = validateImageFile(selectedFile);

    if (validationError) {
      setFeedback({ error: validationError });
      return;
    }

    const alt = uploadAlt.trim();

    if (!alt) {
      setFeedback({ error: "יש להזין טקסט חלופי לפני ההעלאה." });
      return;
    }

    setIsBusy(true);

    try {
      const ext = extensionFromFile(selectedFile);
      const pathname = `site-media/${crypto.randomUUID()}.${ext}`;

      const blob = await upload(pathname, selectedFile, {
        access: "public",
        handleUploadUrl: ADMIN_MEDIA_UPLOAD_URL,
      });

      const formData = new FormData();
      formData.set(
        "payload",
        JSON.stringify({
          originalFilename: selectedFile.name,
          filename: pathname.split("/").pop() ?? selectedFile.name,
          alt,
          mimeType: selectedFile.type as (typeof ALLOWED_IMAGE_MIME_TYPES)[number],
          providerKey: pathname,
          url: blob.url,
          size: selectedFile.size,
        }),
      );

      const result = await registerMediaAssetAction({}, formData);

      if (!result.success || !result.data?.mediaId) {
        setFeedback({ error: result.error ?? "רישום התמונה נכשל." });
        return;
      }

      resetUploadPanel();
      setFeedback({ success: result.success });
      router.refresh();
    } catch (error) {
      setFeedback({
        error:
          error instanceof Error ? error.message : "העלאת התמונה נכשלה. נסו שוב.",
      });
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className={styles.manager}>
      <div className={styles.header}>
        <p className={styles.count}>{assets.length} תמונות</p>
      </div>

      <section className={formStyles.section}>
        <header className={formStyles.sectionHeader}>
          <h2 className={formStyles.sectionTitle}>העלאת תמונה חדשה</h2>
          <p className={formStyles.sectionDescription}>
            קבצים עד {formatUploadBytes(MAX_IMAGE_UPLOAD_BYTES)} — JPEG, PNG, WebP או AVIF.
          </p>
        </header>
        <div className={styles.uploadPanel}>
          <div className={styles.uploadRow}>
            <div className={styles.fileField}>
              <label htmlFor="media-upload-file" className={formStyles.label}>
                קובץ
              </label>
              <input
                ref={fileInputRef}
                id="media-upload-file"
                type="file"
                accept={ALLOWED_IMAGE_MIME_TYPES.join(",")}
                className={styles.fileInput}
                disabled={isBusy}
                onChange={(event) => {
                  setSelectedFile(event.target.files?.[0] ?? null);
                  setFeedback({});
                }}
              />
            </div>
            <div className={styles.altField}>
              <AdminField label="טקסט חלופי" htmlFor="media-upload-alt">
                <input
                  id="media-upload-alt"
                  type="text"
                  className={formStyles.input}
                  value={uploadAlt}
                  maxLength={200}
                  disabled={isBusy}
                  onChange={(event) => setUploadAlt(event.target.value)}
                />
              </AdminField>
            </div>
            <button
              type="button"
              className={styles.uploadButton}
              disabled={isBusy}
              onClick={() => void handleUpload()}
            >
              <Upload size={16} aria-hidden="true" />
              {isBusy ? "מעלה..." : "העלאה"}
            </button>
          </div>
        </div>
      </section>

      <AdminActionFeedback success={feedback.success} error={feedback.error} />

      {assets.length === 0 ? (
        <p className={styles.emptyState}>אין תמונות בספרייה. העלו תמונה ראשונה למעלה.</p>
      ) : (
        <ul className={styles.grid}>
          {assets.map((asset) => {
            const isEditing = editingAltId === asset._id;

            return (
              <li key={asset._id} className={styles.card}>
                <div className={styles.thumbnailWrap}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset.url}
                    alt={asset.alt}
                    className={styles.thumbnail}
                    loading="lazy"
                  />
                </div>

                <div className={styles.cardHeader}>
                  <p className={styles.filename} title={asset.originalFilename}>
                    {asset.originalFilename}
                  </p>
                  <span
                    className={asset.isLocal ? styles.badgeLocal : styles.badgeCloud}
                  >
                    {asset.isLocal
                      ? `${providerLabel(asset.provider)} · לקריאה בלבד`
                      : providerLabel(asset.provider)}
                  </span>
                </div>

                <div className={styles.altSection}>
                  <p className={styles.altLabel}>טקסט חלופי</p>
                  {isEditing ? (
                    <div className={styles.altEdit}>
                      <input
                        type="text"
                        className={formStyles.input}
                        value={draftAlt}
                        maxLength={200}
                        disabled={isBusy}
                        aria-label={`עריכת טקסט חלופי עבור ${asset.originalFilename}`}
                        onChange={(event) => setDraftAlt(event.target.value)}
                      />
                      <div className={styles.altActions}>
                        <button
                          type="button"
                          className={styles.textButton}
                          disabled={isBusy}
                          onClick={() => void saveAlt(asset)}
                        >
                          <Check size={14} aria-hidden="true" /> שמירה
                        </button>
                        <button
                          type="button"
                          className={styles.textButton}
                          disabled={isBusy}
                          onClick={cancelAltEdit}
                        >
                          <X size={14} aria-hidden="true" /> ביטול
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.altDisplay}>
                      <p className={styles.altText}>{asset.alt}</p>
                      <button
                        type="button"
                        className={styles.iconButton}
                        disabled={isBusy}
                        aria-label={`עריכת טקסט חלופי עבור ${asset.originalFilename}`}
                        onClick={() => startAltEdit(asset)}
                      >
                        <Pencil size={16} />
                      </button>
                    </div>
                  )}
                </div>

                <div className={styles.cardActions}>
                  <button
                    type="button"
                    className={styles.iconButton}
                    disabled={isBusy}
                    aria-label={`מחיקת ${asset.originalFilename}`}
                    onClick={() => handleDeleteClick(asset)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {deleteDialog?.kind === "confirm" ? (
        <AdminConfirmDialog
          open
          title="מחיקת תמונה"
          description={`האם למחוק את "${deleteDialog.asset.originalFilename}"? פעולה זו אינה ניתנת לביטול.`}
          onConfirm={() => void handleDeleteConfirm()}
          onCancel={() => setDeleteDialog(null)}
          isPending={isBusy}
        />
      ) : null}

      {deleteDialog?.kind === "blocked" ? (
        <AdminConfirmDialog
          open
          title="לא ניתן למחוק"
          description={deleteDialog.message}
          confirmLabel="הבנתי"
          onConfirm={() => setDeleteDialog(null)}
          onCancel={() => setDeleteDialog(null)}
        />
      ) : null}
    </div>
  );
}
