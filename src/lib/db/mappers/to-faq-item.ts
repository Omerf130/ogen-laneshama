import type { FaqItemLeanDocument } from "@/lib/db/repositories/faq-item.repository";
import { parseWithMapperValidation } from "@/lib/db/mappers/errors";
import { faqItemDocumentSchema } from "@/lib/validation/faq";
import type { FaqItem } from "@/types/homepage";

export function mapFaqItemDocumentToFaqItem(doc: FaqItemLeanDocument): FaqItem {
  const validated = parseWithMapperValidation(
    "FaqItem",
    doc.id,
    faqItemDocumentSchema,
    {
      id: doc.id,
      question: doc.question,
      answer: doc.answer,
      sortOrder: doc.sortOrder,
      isPublished: doc.isPublished,
    },
  );

  return {
    id: validated.id,
    question: validated.question,
    answer: validated.answer,
  };
}

export function mapFaqItemDocumentsToFaqItems(
  docs: FaqItemLeanDocument[],
): FaqItem[] {
  return docs.map(mapFaqItemDocumentToFaqItem);
}
