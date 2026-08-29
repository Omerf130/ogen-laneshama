import { JourneySection } from "../JourneySection";
import { ProcessJourney } from "../ui/ProcessJourney/ProcessJourney";
import type { HomepageProcess } from "@/types/homepage";
import styles from "./ProcessSection.module.scss";

interface ProcessSectionProps {
  content: HomepageProcess;
}

export function ProcessSection({ content }: ProcessSectionProps) {
  return (
    <JourneySection id="process" stage="safety" className={styles.section}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>{content.eyebrow}</p>
        <h2 className={styles.title}>{content.title}</h2>
        <p className={styles.subtitle}>{content.subtitle}</p>
      </header>
      <ProcessJourney steps={content.steps} />
    </JourneySection>
  );
}
