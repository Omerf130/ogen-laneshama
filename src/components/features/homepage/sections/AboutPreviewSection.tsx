import { Button } from "@/components/ui/Button";
import { RevealGroup } from "../ui/RevealGroup/RevealGroup";
import { PortraitFrame } from "../ui/PortraitFrame/PortraitFrame";
import { JourneySection } from "../JourneySection";
import type { HomepageAboutPreview } from "@/types/homepage";
import styles from "./AboutPreviewSection.module.scss";

interface AboutPreviewSectionProps {
  content: HomepageAboutPreview;
  portraitSrc: string | null;
}

function renderWithAccent(text: string, accent?: string) {
  if (!accent || !text.includes(accent)) {
    return text;
  }

  const [before, after] = text.split(accent);

  return (
    <>
      {before}
      <span className={styles.accent}>{accent}</span>
      {after}
    </>
  );
}

export function AboutPreviewSection({
  content,
  portraitSrc,
}: AboutPreviewSectionProps) {
  return (
    <JourneySection id="about-preview" stage="about" className={styles.section}>
      <RevealGroup className={styles.composition}>
        <div className={styles.portraitCol}>
          <PortraitFrame src={portraitSrc} alt={content.title} />
        </div>

        <div className={styles.contentCol}>
          <p className={styles.eyebrow}>{content.eyebrow}</p>
          <h2 className={styles.name}>{content.title}</h2>
          <p className={styles.supporting}>{content.supportingCopy}</p>

          <blockquote className={styles.featured}>
            <p className={styles.featuredText}>
              {renderWithAccent(content.featuredStatement, content.featuredAccent)}
            </p>
          </blockquote>

          <div className={styles.whyBlock}>
            <h3 className={styles.whyTitle}>{content.whyRacheli.title}</h3>
            <ul className={styles.whyList}>
              {content.whyRacheli.points.map((point) => (
                <li key={point} className={styles.whyItem}>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <Button href="/about" variant="secondary" className={styles.cta}>
            {content.ctaLabel}
          </Button>
        </div>
      </RevealGroup>
    </JourneySection>
  );
}
