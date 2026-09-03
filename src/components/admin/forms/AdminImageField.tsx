"use client";

import { ImageIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { AdminField } from "./AdminField";
import { AdminTextInput } from "./AdminTextInput";
import { AdminMediaPicker } from "@/components/admin/media/AdminMediaPicker";
import type {
  AdminImageFieldValue,
  AdminMediaPickerItem,
} from "@/types/admin-media-picker";
import formStyles from "./forms.module.scss";

type AdminImageFieldProps = {
  label: string;
  value: AdminImageFieldValue;
  onChange: (value: AdminImageFieldValue) => void;
  mediaAssets: AdminMediaPickerItem[];
  onMediaAssetsChange?: (assets: AdminMediaPickerItem[]) => void;
  disabled?: boolean;
};

function resolvePreviewSrc(
  value: AdminImageFieldValue,
  mediaAssets: AdminMediaPickerItem[],
): string | null {
  if (value.mediaId) {
    const asset = mediaAssets.find((entry) => entry._id === value.mediaId);

    if (asset?.url) {
      return asset.url;
    }
  }

  return value.src;
}

export function AdminImageField({
  label,
  value,
  onChange,
  mediaAssets,
  onMediaAssetsChange,
  disabled,
}: AdminImageFieldProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [localAssets, setLocalAssets] = useState(mediaAssets);

  const assets = localAssets.length >= mediaAssets.length ? localAssets : mediaAssets;
  const previewSrc = useMemo(() => resolvePreviewSrc(value, assets), [assets, value]);

  const handleSelect = (asset: AdminMediaPickerItem) => {
    onChange({
      mediaId: asset._id,
      src: asset.url,
      alt: value.alt.trim() ? value.alt : asset.alt,
    });
  };

  const handleAssetsChange = (nextAssets: AdminMediaPickerItem[]) => {
    setLocalAssets(nextAssets);
    onMediaAssetsChange?.(nextAssets);
  };

  return (
    <div className={formStyles.imagePreview}>
      <p className={formStyles.label}>{label}</p>

      {previewSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={previewSrc} alt={value.alt || label} className={formStyles.imagePreviewImg} />
      ) : (
        <p className={formStyles.imagePreviewMeta}>אין תמונה מוגדרת</p>
      )}

      <AdminField label="טקסט חלופי" htmlFor={`${label}-alt`}>
        <AdminTextInput
          id={`${label}-alt`}
          value={value.alt}
          onChange={(alt) => onChange({ ...value, alt })}
          disabled={disabled}
        />
      </AdminField>

      <button
        type="button"
        className={formStyles.secondaryButton}
        onClick={() => setPickerOpen(true)}
        disabled={disabled}
      >
        <ImageIcon size={16} aria-hidden />
        בחירה מהספרייה
      </button>

      <AdminMediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleSelect}
        mediaAssets={assets}
        onAssetsChange={handleAssetsChange}
      />
    </div>
  );
}
