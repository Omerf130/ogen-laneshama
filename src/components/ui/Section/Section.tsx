import type { ReactNode } from "react";
import styles from "./Section.module.scss";

interface SectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  "aria-labelledby"?: string;
}

export function Section({
  children,
  id,
  className,
  "aria-labelledby": ariaLabelledBy,
}: SectionProps) {
  const classes = className
    ? `${styles.section} ${className}`
    : styles.section;

  return (
    <section id={id} className={classes} aria-labelledby={ariaLabelledBy}>
      {children}
    </section>
  );
}
