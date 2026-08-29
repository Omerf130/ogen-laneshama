import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JourneySection } from "../JourneySection";
import type { HomepageHero } from "@/types/homepage";
import styles from "./sections.module.scss";

interface HeroSectionProps {
  content: HomepageHero;
  whatsAppUrl: string | null;
}

export function HeroSection({ content, whatsAppUrl }: HeroSectionProps) {
  return (
    <JourneySection id="hero" stage="hero">
      <div className={styles.sectionIntro}>
        <SectionHeading
          title={content.title}
          subtitle={content.subtitle}
          level={1}
        />
      </div>
      <div className={styles.heroActions}>
        {whatsAppUrl ? (
          <Button href={whatsAppUrl} target="_blank" rel="noopener noreferrer">
            {content.ctaPrimary}
          </Button>
        ) : (
          <Button href="/contact">{content.ctaPrimary}</Button>
        )}
        <Button href="#recognition" variant="ghost">
          {content.ctaSecondary}
        </Button>
      </div>
    </JourneySection>
  );
}
