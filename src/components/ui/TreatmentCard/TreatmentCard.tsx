import Link from "next/link";
import type { Treatment } from "@/types/content";
import styles from "./TreatmentCard.module.scss";

interface TreatmentCardProps {
  treatment: Treatment;
}

export function TreatmentCard({ treatment }: TreatmentCardProps) {
  const href = `/treatments/${treatment.slug}`;

  return (
    <Link href={href} className={styles.card}>
      <h2 className={styles.title}>{treatment.title}</h2>
      <p className={styles.description}>{treatment.shortDescription}</p>
      <span className={styles.link}>למידע נוסף</span>
    </Link>
  );
}
