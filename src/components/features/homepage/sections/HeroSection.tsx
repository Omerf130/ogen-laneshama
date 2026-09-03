import { Button } from "@/components/ui/Button";
import { PlacedContentImage } from "@/components/features/content/PlacedContentImage/PlacedContentImage";
import type { HomepageHero, HomepageImageAsset } from "@/types/homepage";
import styles from "./HeroSection.module.scss";

const HERO_IMAGE_FALLBACK = "/images/homepage/hero-editorial.webp";

interface HeroSectionProps {
  content: HomepageHero;
  image?: HomepageImageAsset | null;
  whatsAppUrl: string | null;
}

export function HeroSection({
  content,
  image,
  whatsAppUrl,
}: HeroSectionProps) {
  const heroImage = image?.src ?? HERO_IMAGE_FALLBACK;
  const ctaHref = whatsAppUrl ?? "/contact";
  const ctaExternal = Boolean(whatsAppUrl);

  return (
    <section
      id="hero"
      className={styles.hero}
      data-journey-section="hero"
    >
      <div className={styles.layout}>
        <div className={styles.content}>
          <header className={styles.header}>
            <p className={styles.eyebrow}>{content.eyebrow}</p>
            <h1 className={styles.title}>{content.title}</h1>
            <p className={styles.subtitle}>{content.subtitle}</p>
          </header>
          <div className={styles.ctaRow}>
            {ctaExternal ? (
              <Button
                href={ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.cta}
              >
                {content.ctaPrimary}
              </Button>
            ) : (
              <Button href={ctaHref} className={styles.cta}>
                {content.ctaPrimary}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className={styles.visual} aria-hidden="true">
        <div className={styles.photoFrame}>
          <PlacedContentImage
            src={heroImage}
            alt=""
            fitMode={image?.fitMode}
            objectPosition={image?.objectPosition}
            priority
            sizes="(max-width: 768px) 100vw, 52vw"
            coverClassName={styles.photo}
            containClassName={styles.photoFull}
          />
        </div>
        <div className={styles.ivoryFade} />
        <div className={styles.sageAccent} />
      </div>
    </section>
  );
}
