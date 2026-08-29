import type { ProcessStep } from "@/types/homepage";
import styles from "./ProcessSteps.module.scss";

interface ProcessStepsProps {
  steps: ProcessStep[];
}

export function ProcessSteps({ steps }: ProcessStepsProps) {
  return (
    <ol className={styles.steps}>
      {steps.map((step, index) => (
        <li key={step.title} className={styles.step}>
          <span className={styles.number}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className={styles.title}>{step.title}</h3>
          <p className={styles.description}>{step.description}</p>
        </li>
      ))}
    </ol>
  );
}
