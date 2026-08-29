import Link from "next/link";
import type { Treatment } from "@/types/content";
import styles from "./TreatmentPathItem.module.scss";

interface TreatmentPathItemProps {
  treatment: Treatment;
}

export function TreatmentPathItem({ treatment }: TreatmentPathItemProps) {
  return (
    <Link href={`/treatments/${treatment.slug}`} className={styles.item}>
      <h3 className={styles.title}>{treatment.title}</h3>
      <p className={styles.description}>{treatment.shortDescription}</p>
      <span className={styles.link}>למידע נוסף ←</span>
    </Link>
  );
}
