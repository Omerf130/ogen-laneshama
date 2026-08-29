import type { TestimonialSlot } from "@/types/homepage";
import styles from "./TestimonialQuote.module.scss";

interface TestimonialQuoteProps {
  testimonial: TestimonialSlot;
}

export function TestimonialQuote({ testimonial }: TestimonialQuoteProps) {
  if (!testimonial.quote) return null;

  return (
    <figure className={styles.quote}>
      <span className={styles.mark} aria-hidden="true">
        &ldquo;
      </span>
      <blockquote className={styles.text}>{testimonial.quote}</blockquote>
      {testimonial.name ? (
        <figcaption className={styles.attribution}>
          {testimonial.name}
          {testimonial.context ? (
            <span className={styles.context}> — {testimonial.context}</span>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
