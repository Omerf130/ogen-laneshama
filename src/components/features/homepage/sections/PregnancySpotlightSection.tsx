import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { RevealGroup } from "../ui/RevealGroup/RevealGroup";
import type { HomepagePregnancySpotlight } from "@/types/homepage";
import styles from "./PregnancySpotlightSection.module.scss";

const PREGNANCY_IMAGE = "/images/homepage/pregnancy-editorial.webp";

interface PregnancySpotlightSectionProps {
  content: HomepagePregnancySpotlight;
}

export function PregnancySpotlightSection({
  content,
}: PregnancySpotlightSectionProps) {
  return (
    <section
      id="pregnancy"
      className={styles.section}
      data-journey-section="safety"
    >
      <Container className={styles.container}>
        <div className={styles.shell}>
          <div className={styles.layout}>
            <RevealGroup className={styles.content}>
              <p className={styles.eyebrow}>{content.eyebrow}</p>
              <blockquote className={styles.featured}>
                <p className={styles.featuredText}>{content.featuredStatement}</p>
              </blockquote>
              <p className={styles.excerpt}>{content.excerpt}</p>
              <p className={styles.disclaimer}>{content.disclaimer}</p>
              <Button
                href="/pregnancy-motherhood"
                variant="secondary"
                className={styles.cta}
              >
                {content.ctaLabel}
              </Button>
            </RevealGroup>
          </div>

          <div className={styles.visual} aria-hidden="true">
            <div className={styles.photoFrame}>
              <Image
                src={PREGNANCY_IMAGE}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className={styles.photo}
              />
            </div>
            <div className={styles.atmosphereFade} />
          </div>
        </div>
      </Container>
    </section>
  );
}
