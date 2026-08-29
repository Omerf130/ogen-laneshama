import { Button } from "@/components/ui/Button";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JourneySection } from "../JourneySection";
import type { HomepageAboutPreview } from "@/types/homepage";
import styles from "./sections.module.scss";

interface AboutPreviewSectionProps {
  content: HomepageAboutPreview;
  portraitSrc: string | null;
}

export function AboutPreviewSection({
  content,
  portraitSrc,
}: AboutPreviewSectionProps) {
  return (
    <JourneySection id="about-preview" stage="about">
      <div className={styles.aboutLayout}>
        <div className={styles.aboutMedia}>
          {portraitSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={portraitSrc} alt={content.title} />
          ) : (
            <MediaPlaceholder label="תמונת רחלי תתווסף בשלב הבא" />
          )}
        </div>
        <div className={styles.aboutText}>
          <SectionHeading
            title={content.title}
            subtitle={content.subtitle}
            level={2}
          />
          <p className={styles.excerpt}>{content.excerpt}</p>
          <div className={styles.block}>
            <h3 className={styles.blockTitle}>{content.whyRacheli.title}</h3>
            <ul className={styles.blockList}>
              {content.whyRacheli.points.map((point) => (
                <li key={point} className={styles.blockItem}>
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <Button href="/about" variant="secondary">
            {content.ctaLabel}
          </Button>
        </div>
      </div>
    </JourneySection>
  );
}
