import "server-only";

import { testimonials } from "@/content/homepage/testimonials.data";
import { readContent } from "@/lib/content/internal/read-content";
import { readTestimonialsFromDb } from "@/lib/content/internal/cached-reads";
import type { TestimonialSlot } from "@/types/homepage";

export async function getTestimonials(): Promise<TestimonialSlot[]> {
  return readContent({
    getter: "getTestimonials",
    domain: "testimonials",
    staticRead: () => testimonials,
    dbRead: readTestimonialsFromDb,
    allowFallbackOnMissing: false,
  });
}
