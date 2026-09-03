import { randomUUID } from "node:crypto";
import { FaqItemModel } from "@/lib/db/models/faq-item.model";
import {
  PUBLISHED_FAQ_FILTER,
  PUBLISHED_FAQ_SORT,
} from "@/lib/db/repositories/constants";
import { ensureDbConnection, returnUpdatedDocument } from "@/lib/db/repositories/shared";
import type { FaqItemDocumentInput } from "@/lib/validation/faq";

export type FaqItemLeanDocument = FaqItemDocumentInput & {
  _id: unknown;
  createdAt?: Date;
  updatedAt?: Date;
};

export async function findPublishedFaqItems(): Promise<FaqItemLeanDocument[]> {
  await ensureDbConnection();

  return FaqItemModel.find(PUBLISHED_FAQ_FILTER)
    .sort(PUBLISHED_FAQ_SORT)
    .lean<FaqItemLeanDocument[]>()
    .exec();
}

export async function findAllFaqItemsForAdmin(): Promise<FaqItemLeanDocument[]> {
  await ensureDbConnection();

  return FaqItemModel.find({}).sort(PUBLISHED_FAQ_SORT).lean<FaqItemLeanDocument[]>().exec();
}

export async function countPublishedFaqItems(): Promise<number> {
  await ensureDbConnection();

  return FaqItemModel.countDocuments(PUBLISHED_FAQ_FILTER).exec();
}

export async function createFaqItem(
  input: Omit<FaqItemDocumentInput, "id" | "sortOrder">,
): Promise<FaqItemLeanDocument> {
  await ensureDbConnection();

  const count = await FaqItemModel.countDocuments().exec();
  const id = randomUUID();

  const doc = await FaqItemModel.create({
    id,
    question: input.question,
    answer: input.answer,
    isPublished: input.isPublished,
    sortOrder: count,
  });

  return doc.toObject() as FaqItemLeanDocument;
}

export async function updateFaqItemById(
  id: string,
  input: Omit<FaqItemDocumentInput, "id" | "sortOrder">,
): Promise<FaqItemLeanDocument | null> {
  await ensureDbConnection();

  return FaqItemModel.findOneAndUpdate(
    { id },
    {
      $set: {
        question: input.question,
        answer: input.answer,
        isPublished: input.isPublished,
      },
    },
    { ...returnUpdatedDocument, runValidators: true },
  )
    .lean<FaqItemLeanDocument>()
    .exec();
}

export async function deleteFaqItemById(id: string): Promise<boolean> {
  await ensureDbConnection();

  const result = await FaqItemModel.deleteOne({ id }).exec();

  return result.deletedCount === 1;
}

export async function updateFaqItemSortOrders(
  updates: Array<{ id: string; sortOrder: number }>,
): Promise<void> {
  await ensureDbConnection();

  await Promise.all(
    updates.map(({ id, sortOrder }) =>
      FaqItemModel.updateOne({ id }, { $set: { sortOrder } }).exec(),
    ),
  );
}

export async function setFaqItemPublished(
  id: string,
  isPublished: boolean,
): Promise<FaqItemLeanDocument | null> {
  await ensureDbConnection();

  return FaqItemModel.findOneAndUpdate(
    { id },
    { $set: { isPublished } },
    { ...returnUpdatedDocument, runValidators: true },
  )
    .lean<FaqItemLeanDocument>()
    .exec();
}
