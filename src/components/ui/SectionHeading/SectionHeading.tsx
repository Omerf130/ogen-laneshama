import type { ReactNode } from "react";
import styles from "./SectionHeading.module.scss";

type HeadingLevel = 1 | 2 | 3;

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  level?: HeadingLevel;
  id?: string;
  children?: ReactNode;
}

export function SectionHeading({
  title,
  subtitle,
  level = 1,
  id,
}: SectionHeadingProps) {
  const HeadingTag = `h${level}` as const;

  return (
    <header>
      <HeadingTag id={id} className={styles.heading}>
        {title}
      </HeadingTag>
      {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
    </header>
  );
}
