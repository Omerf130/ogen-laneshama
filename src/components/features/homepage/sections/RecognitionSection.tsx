import { SectionHeading } from "@/components/ui/SectionHeading";
import { JourneySection } from "../JourneySection";
import type { HomepageRecognition } from "@/types/homepage";
import styles from "./sections.module.scss";

interface RecognitionSectionProps {
  content: HomepageRecognition;
}

export function RecognitionSection({ content }: RecognitionSectionProps) {
  return (
    <JourneySection id="recognition" stage="recognition">
      <div className={styles.sectionIntro}>
        <SectionHeading
          title={content.title}
          subtitle={content.subtitle}
          level={2}
        />
      </div>
      <ul className={styles.statements}>
        {content.statements.map((statement) => (
          <li key={statement} className={styles.statement}>
            {statement}
          </li>
        ))}
      </ul>
      <div className={styles.block}>
        <h3 className={styles.blockTitle}>{content.whoIsItFor.title}</h3>
        <ul className={styles.blockList}>
          {content.whoIsItFor.items.map((item) => (
            <li key={item} className={styles.blockItem}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </JourneySection>
  );
}
