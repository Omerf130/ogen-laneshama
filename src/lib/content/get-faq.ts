import { faqItems } from "@/content/homepage/faq.data";
import type { FaqItem } from "@/types/homepage";

export async function getFaqItems(): Promise<FaqItem[]> {
  return faqItems;
}
