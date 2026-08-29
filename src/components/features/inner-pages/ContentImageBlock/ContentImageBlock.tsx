import Image from "next/image";
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
      <Image
        src={image.src}
        alt={image.alt}
        width={400}
        height={500}
        className={styles.image}
      />
    </figure>
  );
}
