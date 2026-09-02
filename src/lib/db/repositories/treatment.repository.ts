import { TreatmentModel } from "@/lib/db/models/treatment.model";
import {
  ACTIVE_TREATMENTS_FILTER,
  ACTIVE_TREATMENTS_SORT,
} from "@/lib/db/repositories/constants";
import { ensureDbConnection } from "@/lib/db/repositories/shared";
import type { TreatmentDocumentInput } from "@/lib/validation/treatment";

export type TreatmentLeanDocument = TreatmentDocumentInput & {
  _id: unknown;
  createdAt?: Date;
  updatedAt?: Date;
};

export async function findActiveTreatments(): Promise<TreatmentLeanDocument[]> {
  await ensureDbConnection();

  return TreatmentModel.find(ACTIVE_TREATMENTS_FILTER)
    .sort(ACTIVE_TREATMENTS_SORT)
    .lean<TreatmentLeanDocument[]>()
    .exec();
}

export async function findActiveTreatmentBySlug(
  slug: string,
): Promise<TreatmentLeanDocument | null> {
  await ensureDbConnection();

  return TreatmentModel.findOne({ ...ACTIVE_TREATMENTS_FILTER, slug })
    .lean<TreatmentLeanDocument>()
    .exec();
}
