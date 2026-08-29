import { Button } from "@/components/ui/Button";
import { JourneySection } from "../JourneySection";
import { TreatmentExploreRow } from "../ui/TreatmentExploreRow/TreatmentExploreRow";
import type { HomepageTreatmentsPreview } from "@/types/homepage";
import type { Treatment } from "@/types/content";
import styles from "./TreatmentsPreviewSection.module.scss";

interface TreatmentsPreviewSectionProps {
  content: HomepageTreatmentsPreview;
  treatments: Treatment[];
}

export function TreatmentsPreviewSection({
  content,
  treatments,
}: TreatmentsPreviewSectionProps) {
  return (
    <JourneySection
      id="treatments-preview"
      stage="treatments"
      className={styles.section}
    >
      <header className={styles.header}>
        <p className={styles.eyebrow}>{content.eyebrow}</p>
        <h2 className={styles.title}>{content.title}</h2>
        <p className={styles.subtitle}>{content.subtitle}</p>
      </header>

      <div className={styles.list}>
        {treatments.map((treatment) => (
          <TreatmentExploreRow
            key={treatment.slug}
            treatment={treatment}
          />
        ))}
      </div>

      <Button href="/treatments" variant="ghost" className={styles.footerCta}>
        {content.ctaLabel}
      </Button>
    </JourneySection>
  );
}
