const BOT_PATTERNS = [
  /bot/i,
  /spider/i,
  /crawl/i,
  /slurp/i,
  /mediapartners/i,
  /facebookexternalhit/i,
  /preview/i,
];

export function isLikelyBotUserAgent(userAgent: string | null): boolean {
  if (!userAgent?.trim()) {
    return false;
  }

  return BOT_PATTERNS.some((pattern) => pattern.test(userAgent));
}
