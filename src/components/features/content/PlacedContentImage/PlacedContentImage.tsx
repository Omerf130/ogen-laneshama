"use client";

import Image from "next/image";
import { getContentImagePositionStyle } from "@/lib/content/content-image-position";
import { resolveContentImageFitMode } from "@/lib/content/content-image-display";
import type { ContentImageFitMode, ContentImageObjectPosition } from "@/types/content";
import styles from "./PlacedContentImage.module.scss";

type PlacedContentImageProps = {
  src: string;
  alt: string;
  fitMode?: ContentImageFitMode;
  objectPosition?: ContentImageObjectPosition;
  sizes: string;
  priority?: boolean;
  coverClassName?: string;
  containClassName?: string;
};

export function PlacedContentImage({
  src,
  alt,
  fitMode,
  objectPosition,
  sizes,
  priority = false,
  coverClassName,
  containClassName,
}: PlacedContentImageProps) {
  const resolvedFitMode = resolveContentImageFitMode(fitMode);

  if (resolvedFitMode === "contain") {
    return (
      <div className={styles.containRoot}>
        <div
          className={styles.blurBackdrop}
          style={{ backgroundImage: `url("${src}")` }}
          aria-hidden="true"
        />
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={[styles.containImage, containClassName].filter(Boolean).join(" ")}
        />
      </div>
    );
  }

  const positionStyle = getContentImagePositionStyle(objectPosition);

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={[styles.coverImage, coverClassName].filter(Boolean).join(" ")}
      style={positionStyle}
    />
  );
}
