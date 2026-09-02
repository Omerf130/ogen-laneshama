import { faqItems } from "@/content/homepage/faq.data";
import type { FaqItemDocumentInput } from "@/lib/validation/faq";

export function buildFaqItemPayloads(): FaqItemDocumentInput[] {
  return faqItems.map((item, index) => ({
    id: item.id,
    question: item.question,
    answer: item.answer,
    sortOrder: index,
    isPublished: true,
  }));
}

export function getExpectedFaqIds(): string[] {
  return faqItems.map((item) => item.id);
}
