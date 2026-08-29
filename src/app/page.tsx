import { pageMetadata } from "@/content/pages/page-metadata";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getSiteConfig } from "@/lib/content/get-site-config";
import { PageShell } from "@/components/layout/PageShell";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { Button } from "@/components/ui/Button";

export const metadata = buildPageMetadata(pageMetadata.home);

export default async function HomePage() {
  const siteConfig = await getSiteConfig();

  return (
    <PageShell>
      <Section id="hero">
        <SectionHeading
          title={siteConfig.businessName}
          subtitle={`ליווי רגשי ורוחני לנשים — ${siteConfig.therapistName}`}
        />
        <MediaPlaceholder label="לוגו ותמונות יתווספו בשלב הבא" />
        <p>דף הבית — תוכן מלא ייבנה בשלב 1.</p>
        <Button href="/contact">יצירת קשר</Button>
      </Section>
      {/* FAQ and testimonials will be homepage sections with #faq / #testimonials anchors in Phase 1 */}
    </PageShell>
  );
}
