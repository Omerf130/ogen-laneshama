"use client";

import { useEffect, useRef } from "react";
import type { ProcessStep } from "@/types/homepage";
import { getSectionScrollProgress } from "./get-section-scroll-progress";
import styles from "./ProcessJourney.module.scss";

interface ProcessJourneyProps {
  steps: ProcessStep[];
}

function formatIndex(index: number) {
  return String(index + 1).padStart(2, "0");
}

export function ProcessJourney({ steps }: ProcessJourneyProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let rafId: number | null = null;

    const applyProgress = (progress: number) => {
      root.style.setProperty("--process-progress", String(progress));

      stepRefs.current.forEach((stepEl, index) => {
        if (!stepEl) return;
        const threshold = (index + 0.35) / steps.length;
        stepEl.toggleAttribute("data-active", progress >= threshold);
      });
    };

    const update = () => {
      rafId = null;
      const progress = motionQuery.matches
        ? 1
        : getSectionScrollProgress(root);
      applyProgress(progress);
    };

    const scheduleUpdate = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(update);
    };

    update();

    if (motionQuery.matches) {
      return;
    }

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });

    const onMotionChange = () => {
      if (motionQuery.matches) {
        applyProgress(1);
      } else {
        scheduleUpdate();
      }
    };

    motionQuery.addEventListener("change", onMotionChange);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      motionQuery.removeEventListener("change", onMotionChange);

      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [steps.length]);

  return (
    <div ref={rootRef} className={styles.journey}>
      <svg
        className={styles.lineDesktop}
        viewBox="0 0 1000 80"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          className={styles.lineTrack}
          d="M 40 40 Q 280 8, 500 40 T 960 40"
          pathLength={1}
          vectorEffect="non-scaling-stroke"
        />
        <path
          className={styles.lineProgress}
          d="M 40 40 Q 280 8, 500 40 T 960 40"
          pathLength={1}
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <svg
        className={styles.lineMobile}
        viewBox="0 0 40 400"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          className={styles.lineTrack}
          d="M 20 20 Q 8 120, 20 200 T 20 380"
          pathLength={1}
          vectorEffect="non-scaling-stroke"
        />
        <path
          className={styles.lineProgress}
          d="M 20 20 Q 8 120, 20 200 T 20 380"
          pathLength={1}
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <ol className={styles.steps}>
        {steps.map((step, index) => (
          <li
            key={step.title}
            ref={(el) => {
              stepRefs.current[index] = el;
            }}
            className={styles.step}
          >
            <span className={styles.number} aria-hidden="true">
              {formatIndex(index)}
            </span>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
