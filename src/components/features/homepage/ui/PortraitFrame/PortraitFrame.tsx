import { PlacedContentImage } from "@/components/features/content/PlacedContentImage/PlacedContentImage";
import type { ContentImageFitMode, ContentImageObjectPosition } from "@/types/content";
import styles from "./PortraitFrame.module.scss";

interface PortraitFrameProps {
  src: string | null;
  alt: string;
  fitMode?: ContentImageFitMode;
  objectPosition?: ContentImageObjectPosition;
}

export function PortraitFrame({
  src,
  alt,
  fitMode,
  objectPosition,
}: PortraitFrameProps) {
  return (
    <div className={styles.frame}>
      <div className={styles.backing} aria-hidden="true" />
      <div className={styles.inner}>
        {src ? (
          <PlacedContentImage
            src={src}
            alt={alt}
            fitMode={fitMode}
            objectPosition={objectPosition}
            sizes="(max-width: 768px) 88vw, 22rem"
            coverClassName={styles.image}
          />
        ) : (
          <div
            className={styles.placeholder}
            role="img"
            aria-label="מקום לתמונת פורטרט של רחלי — תתווסף בשלב הבא"
          />
        )}
      </div>
    </div>
  );
}
