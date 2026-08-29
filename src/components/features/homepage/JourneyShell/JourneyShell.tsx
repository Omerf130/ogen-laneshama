"use client";

import { useEffect, useRef } from "react";
import { JourneyBackground } from "../JourneyBackground";
import styles from "./JourneyShell.module.scss";

interface JourneyShellProps {
  children: React.ReactNode;
}

export function JourneyShell({ children }: JourneyShellProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.setAttribute("data-journey-page", "");

    return () => {
      document.body.removeAttribute("data-journey-page");
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.shell} data-journey-root>
      <JourneyBackground targetRef={rootRef} />
      {children}
    </div>
  );
}
