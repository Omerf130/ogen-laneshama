import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContentBlock } from "@/components/features/inner-pages/ContentBlock";
import { ContentImageBlock } from "@/components/features/inner-pages/ContentImageBlock";
import { DisclaimerNote } from "@/components/features/inner-pages/DisclaimerNote";
import { InnerPageHero } from "@/components/features/inner-pages/InnerPageHero";
import { PageCta } from "@/components/features/inner-pages/PageCta";
import { FaqAccordion } from "@/components/features/homepage/ui/FaqAccordion";
import type { Treatment } from "@/types/content";
import styles from "@/components/features/inner-pages/inner-pages.module.scss";
import detailStyles from "./TreatmentDetail.module.scss";

interface TreatmentDetailProps {
  treatment: Treatment;
}

export function TreatmentDetail({ treatment }: TreatmentDetailProps) {
  const isImmersive = treatment.layoutVariant === "immersive";
  const isProcessFocused = treatment.layoutVariant === "process-focused";

  return (
    <PageShell>
      <Section>
        <div className={styles.page}>
          <nav className={styles.backLink} aria-label="ניווט">
            <Link href="/treatments">← חזרה לכל הדרכים</Link>
          </nav>

          {isImmersive ? (
            <>
              <InnerPageHero
                title={treatment.title}
                subtitle={treatment.shortDescription}
              />
              <p className={detailStyles.emotionalOpening}>
                {treatment.emotionalOpening}
              </p>
              <ContentImageBlock image={treatment.image} />
            </>
          ) : (
            <div className={styles.split}>
              <div className={styles.sections}>
                <InnerPageHero
                  title={treatment.title}
                  subtitle={treatment.shortDescription}
                />
                <p className={detailStyles.emotionalOpening}>
                  {treatment.emotionalOpening}
                </p>
              </div>
              {!isProcessFocused ? (
                <ContentImageBlock image={treatment.image} />
              ) : null}
            </div>
          )}

          <div className={styles.sections}>
            {isProcessFocused ? (
              <>
                <ContentBlock block={treatment.sessionProcess} />
                <ContentBlock block={treatment.whatItIs} />
              </>
            ) : (
              <>
                <ContentBlock block={treatment.whatItIs} />
                <ContentBlock block={treatment.sessionProcess} />
              </>
            )}
            <ContentBlock block={treatment.whoItSuits} />
            <ContentBlock block={treatment.supportiveGoals} />
            <ContentBlock block={treatment.expectations} />
          </div>

          {treatment.disclaimer ? (
            <DisclaimerNote text={treatment.disclaimer} />
          ) : null}

          {treatment.faq && treatment.faq.length > 0 ? (
            <section aria-labelledby="treatment-faq-heading">
              <SectionHeading
                title="שאלות נפוצות"
                level={2}
                id="treatment-faq-heading"
              />
              <FaqAccordion items={treatment.faq} />
            </section>
          ) : null}

          <PageCta cta={treatment.cta} />
        </div>
      </Section>
    </PageShell>
  );
}
