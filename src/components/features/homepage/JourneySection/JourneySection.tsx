import type { ReactNode } from "react";
import type { JourneyStage } from "@/types/homepage";
import { Container } from "@/components/ui/Container";
import styles from "./JourneySection.module.scss";

interface JourneySectionProps {
  id: string;
  stage: JourneyStage;
  children: ReactNode;
  className?: string;
}

export function JourneySection({
  id,
  stage,
  children,
  className,
}: JourneySectionProps) {
  const sectionClass = className
    ? `${styles.section} ${className}`
    : styles.section;

  return (
    <section
      id={id}
      className={sectionClass}
      data-journey-section={stage}
    >
      <Container>
        <div className={styles.content}>{children}</div>
      </Container>
    </section>
  );
}
