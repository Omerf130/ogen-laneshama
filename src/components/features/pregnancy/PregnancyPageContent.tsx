import { PageShell } from "@/components/layout/PageShell";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContentBlock } from "@/components/features/inner-pages/ContentBlock";
import { ContentImageBlock } from "@/components/features/inner-pages/ContentImageBlock";
import { DisclaimerNote } from "@/components/features/inner-pages/DisclaimerNote";
import { InnerPageHero } from "@/components/features/inner-pages/InnerPageHero";
import { PageCta } from "@/components/features/inner-pages/PageCta";
import type { PregnancyMotherhoodContent } from "@/types/content";
import styles from "../inner-pages/inner-pages.module.scss";
import momentStyles from "./PregnancyPageContent.module.scss";

interface PregnancyPageContentProps {
  content: PregnancyMotherhoodContent;
}

export function PregnancyPageContent({ content }: PregnancyPageContentProps) {
  return (
    <PageShell>
      <Section>
        <div className={styles.page}>
          <InnerPageHero
            title={content.hero.title}
            subtitle={content.hero.subtitle}
          />

          <ContentBlock block={content.recognition} />

          <section aria-labelledby="pregnancy-moments-heading">
            <SectionHeading
              title={content.moments.title}
              level={2}
              id="pregnancy-moments-heading"
            />
            <ul className={momentStyles.moments}>
              {content.moments.items.map((moment) => (
                <li key={moment.title} className={momentStyles.moment}>
                  <h3 className={momentStyles.momentTitle}>{moment.title}</h3>
                  <p className={momentStyles.momentDesc}>{moment.description}</p>
                </li>
              ))}
            </ul>
          </section>

          <div className={styles.split}>
            <div className={styles.sections}>
              <ContentBlock block={content.howSupportHelps} />
              <ContentBlock block={content.process} />
              <ContentBlock block={content.reassurance} />
            </div>
            <ContentImageBlock image={content.image} />
          </div>

          <DisclaimerNote text={content.disclaimer} />
          <PageCta cta={content.cta} />
        </div>
      </Section>
    </PageShell>
  );
}
