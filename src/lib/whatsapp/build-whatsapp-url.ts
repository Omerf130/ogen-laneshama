export function buildWhatsAppUrl(
  number: string,
  message?: string,
): string | null {
  const digits = number.replace(/\D/g, "");

  if (!digits) {
    return null;
  }

  const base = `https://wa.me/${digits}`;

  if (!message?.trim()) {
    return base;
  }

  return `${base}?text=${encodeURIComponent(message)}`;
}
