import { PageShell } from "@/components/layout/PageShell";
import { Section } from "@/components/ui/Section";
import { InnerPageHero } from "@/components/features/inner-pages/InnerPageHero";
import { PageCta } from "@/components/features/inner-pages/PageCta";
import { TreatmentOverviewItem } from "@/components/features/treatments/TreatmentOverviewItem";
import type { Treatment, TreatmentsIndexContent } from "@/types/content";
import styles from "@/components/features/inner-pages/inner-pages.module.scss";
import introStyles from "./TreatmentsIndexContent.module.scss";

interface TreatmentsIndexContentProps {
  content: TreatmentsIndexContent;
  treatments: Treatment[];
}

export function TreatmentsIndexContent({
  content,
  treatments,
}: TreatmentsIndexContentProps) {
  return (
    <PageShell>
      <Section>
        <div className={styles.page}>
          <InnerPageHero title={content.title} subtitle={content.subtitle} />
          <p className={introStyles.intro}>{content.intro}</p>

          <ul className={introStyles.list}>
            {treatments.map((treatment, index) => (
              <TreatmentOverviewItem
                key={treatment.slug}
                treatment={treatment}
                index={index}
              />
            ))}
          </ul>

          <PageCta cta={content.cta} />
        </div>
      </Section>
    </PageShell>
  );
}
