import { connectDB } from "@/lib/db/mongoose";

/** Mongoose 9+ — replaces deprecated `new: true` on findOneAndUpdate/findByIdAndUpdate */
export const returnUpdatedDocument = {
  returnDocument: "after" as const,
};

export async function ensureDbConnection(): Promise<void> {
  await connectDB();
}
