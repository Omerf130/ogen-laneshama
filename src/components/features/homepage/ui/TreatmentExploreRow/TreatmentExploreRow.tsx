import Link from "next/link";
import type { Treatment } from "@/types/content";
import { AnchorIcon } from "../AnchorIcon/AnchorIcon";
import styles from "./TreatmentExploreRow.module.scss";

interface TreatmentExploreRowProps {
  treatment: Treatment;
}

export function TreatmentExploreRow({ treatment }: TreatmentExploreRowProps) {
  return (
    <Link
      href={`/treatments/${treatment.slug}`}
      className={styles.row}
    >
      <span className={styles.anchorWrap} aria-hidden="true">
        <AnchorIcon className={styles.anchor} />
      </span>
      <div className={styles.body}>
        <h3 className={styles.title}>{treatment.title}</h3>
        <p className={styles.description}>{treatment.shortDescription}</p>
      </div>
      <span className={styles.arrow} aria-hidden="true">
        ←
      </span>
    </Link>
  );
}
