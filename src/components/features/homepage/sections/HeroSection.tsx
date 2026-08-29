import Image from "next/image";
import { Button } from "@/components/ui/Button";
import type { HomepageHero } from "@/types/homepage";
import styles from "./HeroSection.module.scss";

const HERO_IMAGE = "/images/homepage/hero-editorial.webp";

interface HeroSectionProps {
  content: HomepageHero;
  whatsAppUrl: string | null;
}

export function HeroSection({ content, whatsAppUrl }: HeroSectionProps) {
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
          <Image
            src={HERO_IMAGE}
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 100vw, 52vw"
            className={styles.photo}
          />
        </div>
        <div className={styles.ivoryFade} />
        <div className={styles.sageAccent} />
      </div>
    </section>
  );
}
