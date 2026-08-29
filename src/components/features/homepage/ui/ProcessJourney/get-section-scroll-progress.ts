/**
 * Returns 0 when the section top reaches the viewport bottom,
 * and 1 when the section bottom reaches the viewport top.
 */
export function getSectionScrollProgress(element: HTMLElement): number {
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const scrollableDistance = rect.height + viewportHeight;

  if (scrollableDistance <= 0) {
    return 0;
  }

  const travelled = viewportHeight - rect.top;
  return Math.min(1, Math.max(0, travelled / scrollableDistance));
}
