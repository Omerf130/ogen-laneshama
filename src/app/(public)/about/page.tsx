import { pageMetadata } from "@/content/pages/page-metadata";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getAboutContent } from "@/lib/content/get-about-content";
import { PageShell } from "@/components/layout/PageShell";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import styles from "./page.module.scss";

export const metadata = buildPageMetadata(pageMetadata.about);

export default async function AboutPage() {
  const content = await getAboutContent();

  return (
    <PageShell>
      <Section>
        <SectionHeading title={content.title} subtitle={content.shortDescription} />
        <MediaPlaceholder label="תמונת רחלי תתווסף בשלב הבא" />
        <p className={styles.body}>{content.longDescription}</p>
      </Section>
    </PageShell>
  );
}
