import { pageMetadata } from "@/content/pages/page-metadata";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getPregnancyMotherhoodContent } from "@/lib/content/get-pregnancy-motherhood-content";
import { PageShell } from "@/components/layout/PageShell";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { Button } from "@/components/ui/Button";
import styles from "./page.module.scss";

export const metadata = buildPageMetadata(pageMetadata.pregnancyMotherhood);

export default async function PregnancyMotherhoodPage() {
  const content = await getPregnancyMotherhoodContent();

  return (
    <PageShell>
      <Section>
        <SectionHeading title={content.title} subtitle={content.shortDescription} />
        <MediaPlaceholder />
        <p className={styles.body}>{content.longDescription}</p>
        <p className={styles.note}>{content.contentNote}</p>
        <Button href="/contact">יצירת קשר</Button>
      </Section>
    </PageShell>
  );
}
