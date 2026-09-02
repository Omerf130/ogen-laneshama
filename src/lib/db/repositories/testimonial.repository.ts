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

export async function findAllTestimonialsForAdmin(): Promise<
  TestimonialLeanDocument[]
> {
  await ensureDbConnection();

  return TestimonialModel.find({})
    .sort(PUBLISHED_TESTIMONIAL_SORT)
    .lean<TestimonialLeanDocument[]>()
    .exec();
}

export async function countPublishedTestimonials(): Promise<number> {
  await ensureDbConnection();

  return TestimonialModel.countDocuments(PUBLISHED_TESTIMONIAL_FILTER).exec();
}

export async function createTestimonial(
  input: Omit<TestimonialDocumentInput, "sortOrder">,
): Promise<TestimonialLeanDocument> {
  await ensureDbConnection();

  const count = await TestimonialModel.countDocuments().exec();

  const doc = await TestimonialModel.create({
    quote: input.quote,
    name: input.name,
    context: input.context,
    isPublished: input.isPublished,
    sortOrder: count,
  });

  return doc.toObject() as TestimonialLeanDocument;
}

export async function updateTestimonialById(
  mongoId: string,
  input: Omit<TestimonialDocumentInput, "sortOrder">,
): Promise<TestimonialLeanDocument | null> {
  await ensureDbConnection();

  return TestimonialModel.findByIdAndUpdate(
    mongoId,
    {
      $set: {
        quote: input.quote,
        name: input.name,
        context: input.context,
        isPublished: input.isPublished,
      },
    },
    { new: true, runValidators: true },
  )
    .lean<TestimonialLeanDocument>()
    .exec();
}

export async function deleteTestimonialById(mongoId: string): Promise<boolean> {
  await ensureDbConnection();

  const result = await TestimonialModel.deleteOne({ _id: mongoId }).exec();

  return result.deletedCount === 1;
}

export async function updateTestimonialSortOrders(
  updates: Array<{ mongoId: string; sortOrder: number }>,
): Promise<void> {
  await ensureDbConnection();

  await Promise.all(
    updates.map(({ mongoId, sortOrder }) =>
      TestimonialModel.updateOne({ _id: mongoId }, { $set: { sortOrder } }).exec(),
    ),
  );
}

export async function setTestimonialPublished(
  mongoId: string,
  isPublished: boolean,
): Promise<TestimonialLeanDocument | null> {
  await ensureDbConnection();

  return TestimonialModel.findByIdAndUpdate(
    mongoId,
    { $set: { isPublished } },
    { new: true, runValidators: true },
  )
    .lean<TestimonialLeanDocument>()
    .exec();
}
