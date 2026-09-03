"use client";

import { upload } from "@vercel/blob/client";
import { Search, Upload, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { AdminActionFeedback, AdminField } from "@/components/admin/forms";
import { registerMediaAssetAction } from "@/features/admin/media/media.actions";
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
import type { AdminMediaPickerItem } from "@/types/admin-media-picker";
import formStyles from "@/components/admin/forms/forms.module.scss";
import styles from "./AdminMediaPicker.module.scss";

type AdminMediaPickerProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (asset: AdminMediaPickerItem) => void;
  mediaAssets: AdminMediaPickerItem[];
  onAssetsChange?: (assets: AdminMediaPickerItem[]) => void;
};

function providerLabel(provider: string): string {
  if (provider === VERCEL_BLOB_PROVIDER) {
    return "ענן";
  }

  return "מקומי";
}

function mergeAssets(
  primary: AdminMediaPickerItem[],
  secondary: AdminMediaPickerItem[],
): AdminMediaPickerItem[] {
  const byId = new Map<string, AdminMediaPickerItem>();

  for (const asset of [...secondary, ...primary]) {
    byId.set(asset._id, asset);
  }

  return [...byId.values()];
}

export function AdminMediaPicker({
  open,
  onClose,
  onSelect,
  mediaAssets,
  onAssetsChange,
}: AdminMediaPickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedAssets, setUploadedAssets] = useState<AdminMediaPickerItem[]>([]);
  const [query, setQuery] = useState("");
  const [uploadAlt, setUploadAlt] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const assets = useMemo(
    () => mergeAssets(uploadedAssets, mediaAssets),
    [mediaAssets, uploadedAssets],
  );

  const filteredAssets = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return assets;
    }

    return assets.filter(
      (asset) =>
        asset.alt.toLowerCase().includes(normalized) ||
        asset.filename.toLowerCase().includes(normalized),
    );
  }, [assets, query]);

  const resetUploadPanel = () => {
    setQuery("");
    setUploadAlt("");
    setSelectedFile(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    resetUploadPanel();
    onClose();
  };

  const handleUpload = async () => {
    setUploadError(null);

    if (!selectedFile) {
      setUploadError("יש לבחור קובץ תמונה.");
      return;
    }

    const validationError = validateImageFile(selectedFile);

    if (validationError) {
      setUploadError(validationError);
      return;
    }

    const alt = uploadAlt.trim();

    if (!alt) {
      setUploadError("יש להזין טקסט חלופי לפני ההעלאה.");
      return;
    }

    setIsUploading(true);

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
          filename: pathname.split("/").pop() ?? pathname,
          alt,
          mimeType: selectedFile.type as (typeof ALLOWED_IMAGE_MIME_TYPES)[number],
          providerKey: pathname,
          url: blob.url,
          size: selectedFile.size,
        }),
      );

      const registerResult = await registerMediaAssetAction({}, formData);

      if (!registerResult.success || !registerResult.data?.mediaId) {
        setUploadError(registerResult.error ?? "רישום התמונה נכשל.");
        return;
      }

      const created: AdminMediaPickerItem = {
        _id: registerResult.data.mediaId,
        url: registerResult.data.url ?? blob.url,
        alt: registerResult.data.alt ?? alt,
        filename: registerResult.data.filename ?? pathname.split("/").pop() ?? "upload",
        provider: registerResult.data.provider ?? VERCEL_BLOB_PROVIDER,
      };

      const nextAssets = mergeAssets([created], assets);
      setUploadedAssets((current) => mergeAssets([created], current));
      onAssetsChange?.(nextAssets);
      resetUploadPanel();
      onSelect(created);
      handleClose();
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "העלאת התמונה נכשלה. נסו שוב.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className={styles.backdrop} role="presentation" onClick={handleClose}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="media-picker-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 id="media-picker-title" className={styles.title}>
            בחירת תמונה
          </h2>
          <button type="button" className={styles.closeButton} onClick={handleClose} aria-label="סגירה">
            <X size={18} aria-hidden />
          </button>
        </div>

        <AdminActionFeedback error={uploadError ?? undefined} />

        <div className={styles.uploadPanel}>
          <AdminField label="העלאת תמונה חדשה" htmlFor="picker-upload-alt">
            <input
              id="picker-upload-alt"
              className={formStyles.input}
              value={uploadAlt}
              onChange={(event) => setUploadAlt(event.target.value)}
              placeholder="טקסט חלופי (חובה)"
              disabled={isUploading}
            />
          </AdminField>
          <div className={styles.uploadRow}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
              disabled={isUploading}
            />
            <button
              type="button"
              className={formStyles.secondaryButton}
              onClick={handleUpload}
              disabled={isUploading}
            >
              <Upload size={16} aria-hidden />
              {isUploading ? "מעלה..." : "העלאה"}
            </button>
          </div>
          <p className={styles.uploadHint}>
            עד {formatUploadBytes(MAX_IMAGE_UPLOAD_BYTES)} · JPEG, PNG, WebP, AVIF
          </p>
        </div>

        <div className={styles.searchRow}>
          <Search size={16} aria-hidden />
          <input
            className={formStyles.input}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="חיפוש לפי שם קובץ או טקסט חלופי"
          />
        </div>

        {filteredAssets.length === 0 ? (
          <p className={styles.empty}>לא נמצאו תמונות.</p>
        ) : (
          <ul className={styles.grid}>
            {filteredAssets.map((asset) => (
              <li key={asset._id}>
                <button
                  type="button"
                  className={styles.card}
                  onClick={() => {
                    onSelect(asset);
                    handleClose();
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset.url} alt={asset.alt} className={styles.thumbnail} />
                  <span className={styles.cardMeta}>
                    <span className={styles.cardAlt}>{asset.alt}</span>
                    <span className={styles.cardFilename}>{asset.filename}</span>
                    <span className={styles.cardProvider}>{providerLabel(asset.provider)}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
