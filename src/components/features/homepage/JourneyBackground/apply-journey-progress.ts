function clamp01(value: number): number {
  return Math.min(Math.max(value, 0), 1);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Smooth, continuous easing — no abrupt transitions */
export function easeJourney(t: number): number {
  const p = clamp01(t);
  return p * p * (3 - 2 * p);
}

interface ApplyJourneyProgressOptions {
  reducedMotion: boolean;
  mobile: boolean;
}

/**
 * Drives composition, scale, depth and light — not dramatic color shifts.
 * Canvas stays warm ivory; forms expand from contained → spacious.
 */
export function applyJourneyProgress(
  element: HTMLElement,
  rawProgress: number,
  options: ApplyJourneyProgressOptions,
): void {
  const progress = easeJourney(rawProgress);
  const motion = options.reducedMotion ? 0 : options.mobile ? 0.5 : 1;

  element.style.setProperty("--journey-p", progress.toFixed(4));

  /* Canvas — imperceptible warmth increase only */
  element.style.setProperty("--canvas-warmth", lerp(0, 0.06, progress).toFixed(3));

  /*
   * Membrane A — large sage form, slow horizontal expansion
   * Top: closer to content centre. End: drifts outward and softens.
   */
  element.style.setProperty(
    "--membrane-a-x",
    `${lerp(8, -26, progress) * motion}%`,
  );
  element.style.setProperty(
    "--membrane-a-y",
    `${lerp(6, -10, progress) * motion}%`,
  );
  element.style.setProperty(
    "--membrane-a-scale",
    lerp(0.94, 1.42, progress).toFixed(3),
  );
  element.style.setProperty(
    "--membrane-a-rotate",
    `${lerp(-4, 7, progress) * motion}deg`,
  );
  element.style.setProperty(
    "--membrane-a-opacity",
    lerp(0.34, 0.13, progress).toFixed(3),
  );

  /*
   * Membrane B — warm neutral form behind, vertical drift + scale
   */
  element.style.setProperty(
    "--membrane-b-x",
    `${lerp(-4, 22, progress) * motion}%`,
  );
  element.style.setProperty(
    "--membrane-b-y",
    `${lerp(12, -18, progress) * motion}%`,
  );
  element.style.setProperty(
    "--membrane-b-scale",
    lerp(0.88, 1.48, progress).toFixed(3),
  );
  element.style.setProperty(
    "--membrane-b-rotate",
    `${lerp(5, -9, progress) * motion}deg`,
  );
  element.style.setProperty(
    "--membrane-b-opacity",
    lerp(0.28, 0.09, progress).toFixed(3),
  );

  /*
   * Flow ribbon — thin translucent membrane, subtle position shift
   */
  element.style.setProperty(
    "--flow-x",
    `${lerp(42, 58, progress) * motion}%`,
  );
  element.style.setProperty(
    "--flow-y",
    `${lerp(38, 52, progress) * motion}%`,
  );
  element.style.setProperty(
    "--flow-scale-x",
    lerp(0.82, 1.62, progress).toFixed(3),
  );
  element.style.setProperty(
    "--flow-scale-y",
    lerp(1, 0.62, progress).toFixed(3),
  );
  element.style.setProperty(
    "--flow-rotate",
    `${lerp(-14, 6, progress) * motion}deg`,
  );
  element.style.setProperty(
    "--flow-opacity",
    lerp(0.2, 0.05, progress).toFixed(3),
  );

  /*
   * Pale sky accent — always restrained, drifts to edge
   */
  element.style.setProperty(
    "--accent-x",
    `${lerp(58, 76, progress) * motion}%`,
  );
  element.style.setProperty(
    "--accent-y",
    `${lerp(22, 8, progress) * motion}%`,
  );
  element.style.setProperty(
    "--accent-scale",
    lerp(0.78, 1.18, progress).toFixed(3),
  );
  element.style.setProperty(
    "--accent-opacity",
    lerp(0.11, 0.04, progress).toFixed(3),
  );

  /*
   * Warm champagne glow — gradually expands through composition
   */
  element.style.setProperty("--glow-x", `${lerp(54, 48, progress)}%`);
  element.style.setProperty(
    "--glow-y",
    `${lerp(68, 38, progress) * (motion || 1)}%`,
  );
  element.style.setProperty(
    "--glow-size",
    `${lerp(32, 88, progress).toFixed(1)}%`,
  );
  element.style.setProperty(
    "--glow-opacity",
    lerp(0.07, 0.22, progress).toFixed(3),
  );
}

export function getJourneyScrollProgress(target: HTMLElement): number {
  const rect = target.getBoundingClientRect();
  const scrollTop = window.scrollY;
  const journeyTop = scrollTop + rect.top;
  const journeyHeight = target.offsetHeight;
  const viewportHeight = window.innerHeight;
  const scrollRange = Math.max(journeyHeight - viewportHeight, 1);

  return clamp01((scrollTop - journeyTop) / scrollRange);
}
