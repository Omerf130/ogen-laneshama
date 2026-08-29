import type { ReactNode } from "react";
import styles from "./WhoIsItForTile.module.scss";

interface WhoIsItForTileProps {
  index: number;
  children: ReactNode;
  variant: "a" | "b" | "c" | "d";
}

function formatIndex(index: number) {
  return String(index + 1).padStart(2, "0");
}

export function WhoIsItForTile({
  index,
  children,
  variant,
}: WhoIsItForTileProps) {
  return (
    <article className={`${styles.tile} ${styles[`tile${variant.toUpperCase()}`]}`}>
      <span className={styles.number} aria-hidden="true">
        {formatIndex(index)}
      </span>
      <p className={styles.text}>{children}</p>
    </article>
  );
}
