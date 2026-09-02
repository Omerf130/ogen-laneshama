import { pingDatabase } from "../src/lib/db/mongoose";
import { loadEnvLocal } from "./lib/load-env-local";

async function main(): Promise<void> {
  loadEnvLocal();

  try {
    await pingDatabase();
    console.log("MongoDB connection check passed.");
    process.exit(0);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown database connection error.";
    console.error(`MongoDB connection check failed: ${message}`);
    process.exit(1);
  }
}

void main();