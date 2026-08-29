"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./RevealGroup.module.scss";

interface RevealGroupProps {
  children: ReactNode;
  className?: string;
}

export function RevealGroup({ children, className }: RevealGroupProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const classes = className
    ? `${styles.reveal} ${visible ? styles.visible : ""} ${className}`
    : `${styles.reveal} ${visible ? styles.visible : ""}`;

  return (
    <div ref={ref} className={classes}>
      {children}
    </div>
  );
}
