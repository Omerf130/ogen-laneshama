import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JourneySection } from "../JourneySection";
import { ProcessSteps } from "../ui/ProcessSteps";
import type { HomepagePregnancySpotlight, HomepageSafety } from "@/types/homepage";
import styles from "./sections.module.scss";

interface SafetySectionProps {
  pregnancy: HomepagePregnancySpotlight;
  safety: HomepageSafety;
}

export function SafetySection({ pregnancy, safety }: SafetySectionProps) {
  return (
    <JourneySection id="safety" stage="safety">
      <div className={styles.safetyBlock}>
        <div className={styles.spotlight}>
          <SectionHeading title={pregnancy.title} level={2} />
          <p className={styles.excerpt}>{pregnancy.excerpt}</p>
          <p className={styles.disclaimer}>{pregnancy.disclaimer}</p>
          <Button href="/pregnancy-motherhood" variant="secondary">
            {pregnancy.ctaLabel}
          </Button>
        </div>

        <div className={styles.processBlock}>
          <SectionHeading
            title={safety.process.title}
            subtitle={safety.process.subtitle}
            level={2}
          />
          <ProcessSteps steps={safety.process.steps} />
        </div>
      </div>
    </JourneySection>
  );
}
