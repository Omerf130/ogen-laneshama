import { testimonials } from "@/content/homepage/testimonials.data";
import type { TestimonialSlot } from "@/types/homepage";

export async function getTestimonials(): Promise<TestimonialSlot[]> {
  return testimonials;
}
