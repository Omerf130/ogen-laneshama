import Image from "next/image";
import styles from "./PortraitFrame.module.scss";

interface PortraitFrameProps {
  src: string | null;
  alt: string;
}

export function PortraitFrame({ src, alt }: PortraitFrameProps) {
  return (
    <div className={styles.frame}>
      <div className={styles.backing} aria-hidden="true" />
      <div className={styles.inner}>
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 88vw, 22rem"
            className={styles.image}
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
