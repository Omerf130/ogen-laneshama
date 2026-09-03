"use client";

import { useMemo, useState } from "react";
import {
  getAspectRatioMismatchHint,
  parseAspectRatio,
} from "@/lib/admin/media/image-placement-presets";
import {
  CONTENT_IMAGE_FIT_MODE_LABELS,
  resolveContentImageFitMode,
} from "@/lib/content/content-image-display";
import {
  formatObjectPositionCss,
  resolvePreviewObjectPosition,
} from "@/lib/content/content-image-position";
import type { ContentImageFitMode, ContentImageObjectPosition } from "@/types/content";
import styles from "./forms.module.scss";

type AdminImagePlacementControlProps = {
  previewSrc: string;
  previewAlt: string;
  aspectRatio: string;
  previewDefault: ContentImageObjectPosition;
  fitMode?: ContentImageFitMode;
  objectPosition?: ContentImageObjectPosition;
  onFitModeChange: (fitMode: ContentImageFitMode) => void;
  onObjectPositionChange: (objectPosition: ContentImageObjectPosition) => void;
  disabled?: boolean;
};

export function AdminImagePlacementControl({
  previewSrc,
  previewAlt,
  aspectRatio,
  previewDefault,
  fitMode,
  objectPosition,
  onFitModeChange,
  onObjectPositionChange,
  disabled = false,
}: AdminImagePlacementControlProps) {
  const [imageAspectRatio, setImageAspectRatio] = useState<number | null>(null);
  const resolvedFitMode = resolveContentImageFitMode(fitMode);
  const effectivePosition = resolvePreviewObjectPosition(objectPosition, previewDefault);
  const containerAspectRatio = useMemo(
    () => parseAspectRatio(aspectRatio),
    [aspectRatio],
  );

  const mismatchHint =
    resolvedFitMode === "cover" && imageAspectRatio !== null
      ? getAspectRatioMismatchHint(imageAspectRatio, containerAspectRatio)
      : null;

  const updateAxis = (axis: "x" | "y", nextValue: number) => {
    onObjectPositionChange({
      ...effectivePosition,
      [axis]: nextValue,
    });
  };

  const modeCopy = CONTENT_IMAGE_FIT_MODE_LABELS[resolvedFitMode];

  return (
    <div className={styles.imagePlacement}>
      <fieldset className={styles.imagePlacementFieldset} disabled={disabled}>
        <legend className={styles.label}>התאמת התמונה</legend>

        <div className={styles.imagePlacementModes}>
          {(Object.keys(CONTENT_IMAGE_FIT_MODE_LABELS) as ContentImageFitMode[]).map(
            (mode) => (
              <label key={mode} className={styles.imagePlacementModeOption}>
                <input
                  type="radio"
                  name={`image-fit-${previewAlt}`}
                  value={mode}
                  checked={resolvedFitMode === mode}
                  onChange={() => onFitModeChange(mode)}
                  disabled={disabled}
                  suppressHydrationWarning
                />
                <span>{CONTENT_IMAGE_FIT_MODE_LABELS[mode].label}</span>
              </label>
            ),
          )}
        </div>

        <p className={styles.helper}>{modeCopy.helper}</p>
      </fieldset>

      <div className={styles.imagePositionFrame} style={{ aspectRatio }}>
        {resolvedFitMode === "contain" ? (
          <>
            <div
              className={styles.imagePlacementBlurBackdrop}
              style={{ backgroundImage: `url("${previewSrc}")` }}
              aria-hidden="true"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewSrc}
              alt={previewAlt}
              className={styles.imagePlacementContainPreview}
              onLoad={(event) => {
                const image = event.currentTarget;
                setImageAspectRatio(image.naturalWidth / image.naturalHeight);
              }}
            />
          </>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewSrc}
            alt={previewAlt}
            className={styles.imagePositionPreview}
            style={{ objectPosition: formatObjectPositionCss(effectivePosition) }}
            onLoad={(event) => {
              const image = event.currentTarget;
              setImageAspectRatio(image.naturalWidth / image.naturalHeight);
            }}
          />
        )}
      </div>

      {mismatchHint ? (
        <p className={styles.imagePreviewNotice}>{mismatchHint}</p>
      ) : null}

      {resolvedFitMode === "cover" ? (
        <div className={styles.imagePosition}>
          <p className={styles.label}>מיקום התמונה</p>
          <p className={styles.helper}>
            הזיזי את התמונה כדי לבחור איזה אזור יישאר גלוי באתר.
          </p>

          <div className={styles.imagePositionSliders}>
            <label className={styles.imagePositionSliderLabel} htmlFor="image-position-x">
              <span>ימין ← → שמאל</span>
              <input
                id="image-position-x"
                type="range"
                min={0}
                max={100}
                step={1}
                value={effectivePosition.x}
                onChange={(event) => updateAxis("x", Number(event.target.value))}
                disabled={disabled}
                suppressHydrationWarning
              />
            </label>

            <label className={styles.imagePositionSliderLabel} htmlFor="image-position-y">
              <span>למעלה ↑ ↓ למטה</span>
              <input
                id="image-position-y"
                type="range"
                min={0}
                max={100}
                step={1}
                value={effectivePosition.y}
                onChange={(event) => updateAxis("y", Number(event.target.value))}
                disabled={disabled}
                suppressHydrationWarning
              />
            </label>
          </div>
        </div>
      ) : null}
    </div>
  );
}
