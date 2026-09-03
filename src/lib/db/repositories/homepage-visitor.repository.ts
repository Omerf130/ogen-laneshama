import "server-only";

import { HomepageVisitorModel } from "@/lib/db/models/homepage-visitor.model";
import { ensureDbConnection, returnUpdatedDocument } from "@/lib/db/repositories/shared";

export type HomepageVisitorLeanDocument = {
  _id: unknown;
  visitorIdHash: string;
  firstSeenAt: Date;
  lastSeenAt: Date;
  visitCount: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export async function upsertHomepageVisitor(
  visitorIdHash: string,
): Promise<HomepageVisitorLeanDocument> {
  await ensureDbConnection();

  const now = new Date();

  const doc = await HomepageVisitorModel.findOneAndUpdate(
    { visitorIdHash },
    {
      $setOnInsert: { firstSeenAt: now, visitorIdHash },
      $set: { lastSeenAt: now },
      $inc: { visitCount: 1 },
    },
    { ...returnUpdatedDocument, upsert: true, runValidators: true },
  ).lean<HomepageVisitorLeanDocument>();

  if (!doc) {
    throw new Error("Failed to upsert homepage visitor");
  }

  return doc;
}

export async function countHomepageVisitors(): Promise<number> {
  await ensureDbConnection();

  return HomepageVisitorModel.countDocuments().exec();
}

export async function countHomepageVisitorsLast7Days(): Promise<number> {
  await ensureDbConnection();

  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  return HomepageVisitorModel.countDocuments({ lastSeenAt: { $gte: since } }).exec();
}
