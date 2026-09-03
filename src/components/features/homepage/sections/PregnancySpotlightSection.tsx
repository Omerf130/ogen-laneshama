import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PlacedContentImage } from "@/components/features/content/PlacedContentImage/PlacedContentImage";
import { RevealGroup } from "../ui/RevealGroup/RevealGroup";
import type { HomepageImageAsset, HomepagePregnancySpotlight } from "@/types/homepage";
import styles from "./PregnancySpotlightSection.module.scss";

const PREGNANCY_IMAGE_FALLBACK = "/images/homepage/pregnancy-editorial.webp";

interface PregnancySpotlightSectionProps {
  content: HomepagePregnancySpotlight;
  image?: HomepageImageAsset | null;
}

export function PregnancySpotlightSection({
  content,
  image,
}: PregnancySpotlightSectionProps) {
  const pregnancyImage = image?.src ?? PREGNANCY_IMAGE_FALLBACK;

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
              <PlacedContentImage
                src={pregnancyImage}
                alt=""
                fitMode={image?.fitMode}
                objectPosition={image?.objectPosition}
                sizes="(max-width: 768px) 100vw, 50vw"
                coverClassName={styles.photo}
                containClassName={styles.photoFull}
              />
            </div>
            <div className={styles.atmosphereFade} />
          </div>
        </div>
      </Container>
    </section>
  );
}
