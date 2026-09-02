import { TestimonialModel } from "@/lib/db/models/testimonial.model";
import {
  PUBLISHED_TESTIMONIAL_FILTER,
  PUBLISHED_TESTIMONIAL_SORT,
} from "@/lib/db/repositories/constants";
import { ensureDbConnection } from "@/lib/db/repositories/shared";
import type { TestimonialDocumentInput } from "@/lib/validation/testimonial";

export type TestimonialLeanDocument = TestimonialDocumentInput & {
  _id: unknown;
  createdAt?: Date;
  updatedAt?: Date;
};

export async function findPublishedTestimonials(): Promise<
  TestimonialLeanDocument[]
> {
  await ensureDbConnection();

  return TestimonialModel.find(PUBLISHED_TESTIMONIAL_FILTER)
    .sort(PUBLISHED_TESTIMONIAL_SORT)
    .lean<TestimonialLeanDocument[]>()
    .exec();
}
