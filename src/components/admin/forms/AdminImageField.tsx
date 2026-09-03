"use client";

import { ImageIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { AdminMediaPicker } from "@/components/admin/media/AdminMediaPicker";
import {
  IMAGE_PLACEMENT_PRESETS,
  type ImagePlacementPresetKey,
} from "@/lib/admin/media/image-placement-presets";
import { AdminField } from "./AdminField";
import { AdminImagePlacementControl } from "./AdminImagePlacementControl";
import { AdminTextInput } from "./AdminTextInput";
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
  placement?: ImagePlacementPresetKey;
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
  placement,
  disabled,
}: AdminImageFieldProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [localAssets, setLocalAssets] = useState(mediaAssets);
  const placementPreset = placement ? IMAGE_PLACEMENT_PRESETS[placement] : null;

  const assets = localAssets.length >= mediaAssets.length ? localAssets : mediaAssets;
  const previewSrc = useMemo(() => resolvePreviewSrc(value, assets), [assets, value]);

  const handleSelect = (asset: AdminMediaPickerItem) => {
    onChange({
      ...value,
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

      {!previewSrc ? (
        <p className={formStyles.imagePreviewMeta}>אין תמונה מוגדרת</p>
      ) : null}

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

      {previewSrc && placementPreset ? (
        <AdminImagePlacementControl
          previewSrc={previewSrc}
          previewAlt={value.alt || label}
          aspectRatio={placementPreset.aspectRatio}
          previewDefault={placementPreset.previewDefault}
          fitMode={value.fitMode}
          objectPosition={value.objectPosition}
          onFitModeChange={(fitMode) => onChange({ ...value, fitMode })}
          onObjectPositionChange={(objectPosition) =>
            onChange({ ...value, objectPosition })
          }
          disabled={disabled}
        />
      ) : previewSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={previewSrc}
          alt={value.alt || label}
          className={formStyles.imagePreviewImg}
        />
      ) : null}

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
