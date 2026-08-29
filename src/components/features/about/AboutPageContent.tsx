import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { Section } from "@/components/ui/Section";
import { ContentBlock } from "@/components/features/inner-pages/ContentBlock";
import { ContentImageBlock } from "@/components/features/inner-pages/ContentImageBlock";
import { InnerPageHero } from "@/components/features/inner-pages/InnerPageHero";
import { PageCta } from "@/components/features/inner-pages/PageCta";
import type { AboutContent } from "@/types/content";
import styles from "../inner-pages/inner-pages.module.scss";

interface AboutPageContentProps {
  content: AboutContent;
}

export function AboutPageContent({ content }: AboutPageContentProps) {
  return (
    <PageShell>
      <Section>
        <div className={styles.page}>
          <InnerPageHero
            title={content.hero.title}
            subtitle={content.hero.subtitle}
          />

          <div className={styles.split}>
            <ContentImageBlock
              image={content.portrait}
              label="תמונת רחלי תתווסף בשלב הבא"
            />
            <div className={styles.sections}>
              <ContentBlock block={content.introduction} />
            </div>
          </div>

          <div className={styles.sections}>
            <ContentBlock block={content.philosophy} />
            <ContentBlock block={content.approach} />
            <section id={content.methods.id} className={styles.sections}>
              <ContentBlock block={content.methods} />
              <ul className={styles.links}>
                {content.methods.treatmentLinks.map((link) => (
                  <li key={link.slug}>
                    <Link href={`/treatments/${link.slug}`}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </section>
            <ContentBlock block={content.safeSpace} />
          </div>

          <PageCta cta={content.cta} />
        </div>
      </Section>
    </PageShell>
  );
}
