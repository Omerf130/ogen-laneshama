import { JourneySection } from "../JourneySection";
import { FaqAccordion } from "../ui/FaqAccordion/FaqAccordion";
import type { FaqItem, HomepageFaqSection } from "@/types/homepage";
import styles from "./FaqSection.module.scss";

interface FaqSectionProps {
  content: HomepageFaqSection;
  items: FaqItem[];
}

export function FaqSection({ content, items }: FaqSectionProps) {
  return (
    <JourneySection id="faq" stage="faq" className={styles.section}>
      <div className={styles.layout}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>{content.eyebrow}</p>
          <h2 className={styles.title}>{content.title}</h2>
          <p className={styles.subtitle}>{content.subtitle}</p>
        </header>
        <div className={styles.accordionCol}>
          <FaqAccordion items={items} />
        </div>
      </div>
    </JourneySection>
  );
}
