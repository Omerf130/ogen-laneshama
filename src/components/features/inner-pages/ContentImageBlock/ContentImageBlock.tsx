import { PlacedContentImage } from "@/components/features/content/PlacedContentImage/PlacedContentImage";
import type { ContentImage } from "@/types/content";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import styles from "./ContentImageBlock.module.scss";

interface ContentImageBlockProps {
  image: ContentImage;
  label?: string;
}

export function ContentImageBlock({ image, label }: ContentImageBlockProps) {
  if (!image.src) {
    return (
      <MediaPlaceholder
        label={label ?? image.alt}
        className={styles.placeholder}
      />
    );
  }

  return (
    <figure className={styles.figure}>
      <div className={styles.frame}>
        <PlacedContentImage
          src={image.src}
          alt={image.alt}
          fitMode={image.fitMode}
          objectPosition={image.objectPosition}
          sizes="(max-width: 768px) 100vw, 18rem"
        />
      </div>
    </figure>
  );
}
