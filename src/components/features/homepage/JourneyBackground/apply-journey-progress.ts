function clamp01(value: number): number {
  return Math.min(Math.max(value, 0), 1);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Bell curve: peaks at `peak` with width `spread`, returns 0–1 */
function bell(progress: number, peak: number, spread: number): number {
  const distance = Math.abs(progress - peak) / spread;
  return clamp01(1 - distance * distance);
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
 * Drives composition, scale, depth and light across the homepage journey.
 * Canvas stays warm ivory; color rhythm shifts perceptibly but remains calm.
 */
export function applyJourneyProgress(
  element: HTMLElement,
  rawProgress: number,
  options: ApplyJourneyProgressOptions,
): void {
  const progress = easeJourney(rawProgress);
  const motion = options.reducedMotion ? 0 : options.mobile ? 0.5 : 1;

  element.style.setProperty("--journey-p", progress.toFixed(4));

  const earlyPhase = clamp01(1 - progress / 0.48);
  const aboutPhase = bell(progress, 0.28, 0.24);
  const treatmentsPhase = bell(progress, 0.44, 0.22);
  const closurePhase = clamp01((progress - 0.72) / 0.28);

  /* Canvas — warmth builds toward closure */
  element.style.setProperty(
    "--canvas-warmth",
    lerp(0.05, 0.18, progress).toFixed(3),
  );

  /*
   * Membrane A — sage, strong early (Recognition → About)
   */
  element.style.setProperty(
    "--membrane-a-x",
    `${lerp(8, -22, progress) * motion}%`,
  );
  element.style.setProperty(
    "--membrane-a-y",
    `${lerp(6, -8, progress) * motion}%`,
  );
  element.style.setProperty(
    "--membrane-a-scale",
    lerp(1.02, 1.52, progress).toFixed(3),
  );
  element.style.setProperty(
    "--membrane-a-rotate",
    `${lerp(-4, 6, progress) * motion}deg`,
  );
  element.style.setProperty(
    "--membrane-a-opacity",
    lerp(0.34, 0.56, earlyPhase).toFixed(3),
  );

  /*
   * Membrane B — champagne warmth, rises around About
   */
  element.style.setProperty(
    "--membrane-b-x",
    `${lerp(-4, 18, progress) * motion}%`,
  );
  element.style.setProperty(
    "--membrane-b-y",
    `${lerp(12, -14, progress) * motion}%`,
  );
  element.style.setProperty(
    "--membrane-b-scale",
    lerp(0.98, 1.58, progress).toFixed(3),
  );
  element.style.setProperty(
    "--membrane-b-rotate",
    `${lerp(5, -8, progress) * motion}deg`,
  );
  element.style.setProperty(
    "--membrane-b-opacity",
    lerp(0.22, 0.5, aboutPhase).toFixed(3),
  );

  /*
   * Flow ribbon — connector, stronger mid-journey
   */
  element.style.setProperty(
    "--flow-x",
    `${lerp(42, 58, progress) * motion}%`,
  );
  element.style.setProperty(
    "--flow-y",
    `${lerp(38, 50, progress) * motion}%`,
  );
  element.style.setProperty(
    "--flow-scale-x",
    lerp(0.92, 1.62, progress).toFixed(3),
  );
  element.style.setProperty(
    "--flow-scale-y",
    lerp(1, 0.78, progress).toFixed(3),
  );
  element.style.setProperty(
    "--flow-rotate",
    `${lerp(-14, 4, progress) * motion}deg`,
  );
  element.style.setProperty(
    "--flow-opacity",
    lerp(0.16, 0.38, treatmentsPhase).toFixed(3),
  );

  /*
   * Pale blue accent — peaks around Treatments (strongest global shift)
   */
  element.style.setProperty(
    "--accent-x",
    `${lerp(52, 68, progress) * motion}%`,
  );
  element.style.setProperty(
    "--accent-y",
    `${lerp(26, 14, progress) * motion}%`,
  );
  element.style.setProperty(
    "--accent-scale",
    lerp(0.96, 1.48, progress).toFixed(3),
  );
  element.style.setProperty(
    "--accent-opacity",
    lerp(0.12, 0.42, treatmentsPhase).toFixed(3),
  );

  /*
   * Warm champagne glow — expands toward Final CTA
   */
  element.style.setProperty("--glow-x", `${lerp(54, 50, progress)}%`);
  element.style.setProperty(
    "--glow-y",
    `${lerp(62, 28, progress) * (motion || 1)}%`,
  );
  element.style.setProperty(
    "--glow-size",
    `${lerp(44, 108, progress).toFixed(1)}%`,
  );
  element.style.setProperty(
    "--glow-opacity",
    lerp(0.18, 0.52, Math.max(closurePhase, progress * 0.6)).toFixed(3),
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
