import type { TestimonialLeanDocument } from "@/lib/db/repositories/testimonial.repository";
import { parseWithMapperValidation } from "@/lib/db/mappers/errors";
import { testimonialDocumentSchema } from "@/lib/validation/testimonial";
import type { TestimonialSlot } from "@/types/homepage";

export function mapTestimonialDocumentToTestimonialSlot(
  doc: TestimonialLeanDocument,
): TestimonialSlot {
  parseWithMapperValidation(
    "Testimonial",
    String(doc._id),
    testimonialDocumentSchema,
    {
      quote: doc.quote,
      name: doc.name,
      context: doc.context,
      sortOrder: doc.sortOrder,
      isPublished: doc.isPublished,
    },
  );

  const slot: TestimonialSlot = {
    id: String(doc._id),
    quote: doc.quote,
  };

  if (doc.name) {
    slot.name = doc.name;
  }

  if (doc.context) {
    slot.context = doc.context;
  }

  return slot;
}

export function mapTestimonialDocumentsToTestimonialSlots(
  docs: TestimonialLeanDocument[],
): TestimonialSlot[] {
  return docs.map(mapTestimonialDocumentToTestimonialSlot);
}
