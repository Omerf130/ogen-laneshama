import { pageMetadata } from "@/content/pages/page-metadata";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getContactPageContent } from "@/lib/content/get-contact-content";
import { PageShell } from "@/components/layout/PageShell";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./page.module.scss";

export const metadata = buildPageMetadata(pageMetadata.contact);

export default async function ContactPage() {
  const content = await getContactPageContent();

  return (
    <PageShell>
      <Section>
        <SectionHeading title={content.title} subtitle={content.shortDescription} />
        <p className={styles.body}>טופס יצירת קשר יתווסף בשלב הבא.</p>
      </Section>
    </PageShell>
  );
}
