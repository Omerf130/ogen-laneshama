import { PageShell } from "@/components/layout/PageShell";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { Button } from "@/components/ui/Button";
import type { Treatment } from "@/types/content";
import styles from "./TreatmentDetail.module.scss";

interface TreatmentDetailProps {
  treatment: Treatment;
}

export function TreatmentDetail({ treatment }: TreatmentDetailProps) {
  return (
    <PageShell>
      <Section>
        <SectionHeading
          title={treatment.title}
          subtitle={treatment.shortDescription}
        />
        <MediaPlaceholder />
        <p className={styles.body}>{treatment.longDescription}</p>
        <Button href="/contact">יצירת קשר</Button>
      </Section>
    </PageShell>
  );
}
