import { connectDB } from "@/lib/db/mongoose";

export async function ensureDbConnection(): Promise<void> {
  await connectDB();
}
