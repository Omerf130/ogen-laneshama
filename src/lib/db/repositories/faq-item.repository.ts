import { FaqItemModel } from "@/lib/db/models/faq-item.model";
import {
  PUBLISHED_FAQ_FILTER,
  PUBLISHED_FAQ_SORT,
} from "@/lib/db/repositories/constants";
import { ensureDbConnection } from "@/lib/db/repositories/shared";
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
