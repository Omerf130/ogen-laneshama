import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JourneySection } from "../JourneySection";
import type { HomepageContactCta } from "@/types/homepage";
import styles from "./sections.module.scss";

interface ContactCtaSectionProps {
  content: HomepageContactCta;
  whatsAppUrl: string | null;
}

export function ContactCtaSection({
  content,
  whatsAppUrl,
}: ContactCtaSectionProps) {
  return (
    <JourneySection id="contact-cta" stage="cta">
      <div className={styles.ctaBlock}>
        <SectionHeading
          title={content.title}
          subtitle={content.subtitle}
          level={2}
        />
        <div className={styles.heroActions}>
          <Button href="/contact">{content.ctaLabel}</Button>
          {whatsAppUrl ? (
            <Button
              href={whatsAppUrl}
              variant="secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </Button>
          ) : null}
        </div>
      </div>
    </JourneySection>
  );
}
