import { SectionHeading } from "@/components/ui/SectionHeading";
import { JourneySection } from "../JourneySection";
import type { TestimonialSlot } from "@/types/homepage";
import styles from "./sections.module.scss";

interface TestimonialsSectionProps {
  testimonials: TestimonialSlot[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const hasTestimonials = testimonials.some((t) => t.quote);

  return (
    <JourneySection id="testimonials" stage="testimonials">
      <div className={styles.sectionIntro}>
        <SectionHeading
          title="מה נשים משתפות"
          subtitle="המלצות מלקוחות — יתווספו בקרוב."
          level={2}
        />
      </div>
      {hasTestimonials ? (
        <ul className={styles.blockList}>
          {testimonials
            .filter((t) => t.quote)
            .map((t) => (
              <li key={t.id} className={styles.blockItem}>
                {t.quote}
                {t.name ? ` — ${t.name}` : ""}
              </li>
            ))}
        </ul>
      ) : (
        <p className={styles.emptyState}>
          המלצות יתווספו בקרוב. בינתיים, אשמח לשוחח איתך ישירות.
        </p>
      )}
    </JourneySection>
  );
}
