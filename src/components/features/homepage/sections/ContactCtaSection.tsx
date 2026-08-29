import { Button } from "@/components/ui/Button";
import { RevealGroup } from "../ui/RevealGroup/RevealGroup";
import { JourneySection } from "../JourneySection";
import type { HomepageContactCta } from "@/types/homepage";
import styles from "./ContactCtaSection.module.scss";

interface ContactCtaSectionProps {
  content: HomepageContactCta;
  whatsAppUrl: string | null;
}

export function ContactCtaSection({
  content,
  whatsAppUrl,
}: ContactCtaSectionProps) {
  return (
    <JourneySection id="contact-cta" stage="cta" className={styles.section}>
      <RevealGroup className={styles.composition}>
        <p className={styles.eyebrow}>{content.eyebrow}</p>
        <h2 className={styles.featured}>{content.featuredStatement}</h2>
        <p className={styles.subtitle}>{content.subtitle}</p>
        <div className={styles.actions}>
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
      </RevealGroup>
    </JourneySection>
  );
}
