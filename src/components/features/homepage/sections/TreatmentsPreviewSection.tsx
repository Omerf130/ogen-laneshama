import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JourneySection } from "../JourneySection";
import { TreatmentPathItem } from "../ui/TreatmentPathItem";
import type { Treatment } from "@/types/content";
import styles from "./sections.module.scss";

interface TreatmentsPreviewSectionProps {
  treatments: Treatment[];
}

export function TreatmentsPreviewSection({
  treatments,
}: TreatmentsPreviewSectionProps) {
  return (
    <JourneySection id="treatments-preview" stage="treatments">
      <div className={styles.sectionIntro}>
        <SectionHeading
          title="דרכים שבהן אני יכולה ללוות אותך"
          subtitle="כל אישה שונה — נמצא יחד את מה שמתאים לך."
          level={2}
        />
      </div>
      <ul className={styles.treatmentsList}>
        {treatments.map((treatment) => (
          <li key={treatment.slug}>
            <TreatmentPathItem treatment={treatment} />
          </li>
        ))}
      </ul>
      <Button href="/treatments" variant="ghost">
        לכל הטיפולים
      </Button>
    </JourneySection>
  );
}
