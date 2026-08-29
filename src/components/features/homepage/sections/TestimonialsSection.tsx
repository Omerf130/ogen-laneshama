import { JourneySection } from "../JourneySection";
import { TestimonialQuote } from "../ui/TestimonialQuote/TestimonialQuote";
import type {
  HomepageTestimonialsSection,
  TestimonialSlot,
} from "@/types/homepage";
import styles from "./TestimonialsSection.module.scss";

interface TestimonialsSectionProps {
  content: HomepageTestimonialsSection;
  testimonials: TestimonialSlot[];
}

export function TestimonialsSection({
  content,
  testimonials,
}: TestimonialsSectionProps) {
  const quoted = testimonials.filter((t) => t.quote);

  if (quoted.length === 0) {
    return null;
  }

  return (
    <JourneySection id="testimonials" stage="testimonials" className={styles.section}>
      <header className={styles.header}>
        <h2 className={styles.title}>{content.title}</h2>
        <p className={styles.subtitle}>{content.subtitle}</p>
      </header>
      <div className={styles.quotes}>
        {quoted.map((testimonial) => (
          <TestimonialQuote key={testimonial.id} testimonial={testimonial} />
        ))}
      </div>
    </JourneySection>
  );
}
