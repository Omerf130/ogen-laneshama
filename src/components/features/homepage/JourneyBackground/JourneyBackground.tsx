"use client";

import { useEffect, useRef } from "react";
import {
  applyJourneyProgress,
  getJourneyScrollProgress,
} from "./apply-journey-progress";
import styles from "./JourneyBackground.module.scss";

interface JourneyBackgroundProps {
  targetRef: React.RefObject<HTMLElement | null>;
}

export function JourneyBackground({ targetRef }: JourneyBackgroundProps) {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const background = backgroundRef.current;
    const target = targetRef.current;
    if (!background || !target) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 767px)");

    const syncAttributes = () => {
      background.toggleAttribute("data-reduced-motion", motionQuery.matches);
      background.toggleAttribute("data-mobile", mobileQuery.matches);
    };

    const update = () => {
      applyJourneyProgress(
        background,
        getJourneyScrollProgress(target),
        {
          reducedMotion: motionQuery.matches,
          mobile: mobileQuery.matches,
        },
      );
    };

    const scheduleUpdate = () => {
      if (rafRef.current !== null) return;

      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        update();
      });
    };

    syncAttributes();
    update();

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });

    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(target);

    const onMotionChange = () => {
      syncAttributes();
      scheduleUpdate();
    };

    motionQuery.addEventListener("change", onMotionChange);
    mobileQuery.addEventListener("change", onMotionChange);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      resizeObserver.disconnect();
      motionQuery.removeEventListener("change", onMotionChange);
      mobileQuery.removeEventListener("change", onMotionChange);

      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [targetRef]);

  return (
    <div
      ref={backgroundRef}
      className={styles.background}
      aria-hidden="true"
      data-journey-background
    >
      <div className={styles.layerCanvas} />
      <div className={styles.layerMembraneB} />
      <div className={styles.layerMembraneA} />
      <div className={styles.layerAccent} />
      <div className={styles.layerFlow} />
      <div className={styles.layerGlow} />
      <div className={styles.layerGrain} />
    </div>
  );
}
