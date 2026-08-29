import styles from "./SectionHeading.module.scss";

type HeadingLevel = 1 | 2 | 3;

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  level?: HeadingLevel;
  id?: string;
}

const levelClassMap = {
  1: styles.level1,
  2: styles.level2,
  3: styles.level3,
} as const;

export function SectionHeading({
  title,
  subtitle,
  level = 1,
  id,
}: SectionHeadingProps) {
  const headingClass = `${styles.heading} ${levelClassMap[level]}`;

  if (level === 1) {
    return (
      <header>
        <h1 id={id} className={headingClass}>
          {title}
        </h1>
        {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      </header>
    );
  }

  if (level === 2) {
    return (
      <header>
        <h2 id={id} className={headingClass}>
          {title}
        </h2>
        {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      </header>
    );
  }

  return (
    <header>
      <h3 id={id} className={headingClass}>
        {title}
      </h3>
      {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
    </header>
  );
}
