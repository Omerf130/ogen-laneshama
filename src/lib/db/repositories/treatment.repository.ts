import { TreatmentModel } from "@/lib/db/models/treatment.model";
import {
  ACTIVE_TREATMENTS_FILTER,
  ACTIVE_TREATMENTS_SORT,
} from "@/lib/db/repositories/constants";
import { ensureDbConnection, returnUpdatedDocument } from "@/lib/db/repositories/shared";
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

export async function findAllTreatmentsForAdmin(): Promise<TreatmentLeanDocument[]> {
  await ensureDbConnection();

  return TreatmentModel.find({})
    .sort(ACTIVE_TREATMENTS_SORT)
    .lean<TreatmentLeanDocument[]>()
    .exec();
}

export async function findTreatmentBySlugForAdmin(
  slug: string,
): Promise<TreatmentLeanDocument | null> {
  await ensureDbConnection();

  return TreatmentModel.findOne({ slug }).lean<TreatmentLeanDocument>().exec();
}

export async function updateTreatmentBySlug(
  slug: string,
  input: Omit<TreatmentDocumentInput, "slug">,
): Promise<TreatmentLeanDocument> {
  await ensureDbConnection();

  const doc = await TreatmentModel.findOneAndUpdate(
    { slug },
    {
      $set: {
        title: input.title,
        shortDescription: input.shortDescription,
        emotionalOpening: input.emotionalOpening,
        whatItIs: input.whatItIs,
        whoItSuits: input.whoItSuits,
        sessionProcess: input.sessionProcess,
        supportiveGoals: input.supportiveGoals,
        expectations: input.expectations,
        disclaimer: input.disclaimer,
        cta: input.cta,
        image: input.image,
        faq: input.faq,
        layoutVariant: input.layoutVariant,
        isActive: input.isActive,
        sortOrder: input.sortOrder,
        seo: input.seo,
      },
    },
    { ...returnUpdatedDocument, upsert: false, runValidators: true },
  ).lean<TreatmentLeanDocument>();

  if (!doc) {
    throw new Error(`Treatment not found: ${slug}`);
  }

  return doc;
}

export async function setTreatmentActive(
  slug: string,
  isActive: boolean,
): Promise<TreatmentLeanDocument> {
  await ensureDbConnection();

  const doc = await TreatmentModel.findOneAndUpdate(
    { slug },
    { $set: { isActive } },
    { ...returnUpdatedDocument, runValidators: true },
  ).lean<TreatmentLeanDocument>();

  if (!doc) {
    throw new Error(`Treatment not found: ${slug}`);
  }

  return doc;
}

export async function updateTreatmentSortOrders(
  updates: Array<{ slug: string; sortOrder: number }>,
): Promise<void> {
  await ensureDbConnection();

  await Promise.all(
    updates.map(({ slug, sortOrder }) =>
      TreatmentModel.updateOne({ slug }, { $set: { sortOrder } }).exec(),
    ),
  );
}
