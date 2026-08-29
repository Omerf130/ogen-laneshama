import { pageMetadata } from "@/content/pages/page-metadata";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getTreatments } from "@/lib/content/get-treatments";
import { PageShell } from "@/components/layout/PageShell";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TreatmentCard } from "@/components/ui/TreatmentCard";
import styles from "./page.module.scss";

export const metadata = buildPageMetadata(pageMetadata.treatments);

export default async function TreatmentsPage() {
  const treatments = await getTreatments();

  return (
    <PageShell>
      <Section>
        <SectionHeading
          title="טיפולים"
          subtitle="מגוון שירותי ליווי רגשי ורוחני"
        />
        <ul className={styles.grid}>
          {treatments.map((treatment) => (
            <li key={treatment.slug}>
              <TreatmentCard treatment={treatment} />
            </li>
          ))}
        </ul>
      </Section>
    </PageShell>
  );
}
