import Link from "next/link";
import type { Treatment } from "@/types/content";
import styles from "./TreatmentOverviewItem.module.scss";

interface TreatmentOverviewItemProps {
  treatment: Treatment;
  index: number;
}

export function TreatmentOverviewItem({
  treatment,
  index,
}: TreatmentOverviewItemProps) {
  const isOffset = index % 2 === 1;
  const itemClass = isOffset
    ? `${styles.item} ${styles.offset}`
    : styles.item;

  return (
    <li>
      <Link href={`/treatments/${treatment.slug}`} className={itemClass}>
        <h2 className={styles.title}>{treatment.title}</h2>
        <p className={styles.emotional}>{treatment.emotionalOpening}</p>
        <p className={styles.support}>
          {treatment.shortDescription}
        </p>
        <span className={styles.link}>למידע נוסף</span>
      </Link>
    </li>
  );
}
