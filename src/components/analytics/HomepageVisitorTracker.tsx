"use client";

import { useEffect, useRef } from "react";

export function HomepageVisitorTracker() {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) {
      return;
    }

    tracked.current = true;

    void fetch("/api/analytics/homepage-visit", {
      method: "POST",
      credentials: "include",
    }).catch(() => undefined);
  }, []);

  return null;
}
