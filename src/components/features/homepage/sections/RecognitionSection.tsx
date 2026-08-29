import { RevealGroup } from "../ui/RevealGroup/RevealGroup";
import { JourneySection } from "../JourneySection";
import type { HomepageRecognition } from "@/types/homepage";
import styles from "./RecognitionSection.module.scss";

interface RecognitionSectionProps {
  content: HomepageRecognition;
}

function renderFeaturedStatement(text: string, accent?: string) {
  if (!accent || !text.includes(accent)) {
    return text;
  }

  const [before, after] = text.split(accent);

  return (
    <>
      {before}
      <span className={styles.featuredAccent}>{accent}</span>
      {after}
    </>
  );
}

export function RecognitionSection({ content }: RecognitionSectionProps) {
  return (
    <JourneySection
      id="recognition"
      stage="recognition"
      className={styles.section}
    >
      <RevealGroup className={styles.composition}>
        <h2 className={styles.context}>{content.title}</h2>

        <blockquote className={styles.featured}>
          <p className={styles.featuredText}>
            {renderFeaturedStatement(
              content.featuredStatement,
              content.featuredAccent,
            )}
          </p>
        </blockquote>

        <div className={styles.supporting}>
          {content.supportingStatements.map((statement) => (
            <p key={statement} className={styles.supportingLine}>
              {statement}
            </p>
          ))}
          <p className={styles.reassurance}>{content.subtitle}</p>
        </div>
      </RevealGroup>
    </JourneySection>
  );
}
