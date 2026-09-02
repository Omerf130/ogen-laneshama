import { loadEnvLocal } from "./lib/load-env-local";
import { connectDB } from "../src/lib/db/mongoose";
import {
  buildSeedPlan,
  executeSeed,
  getSeedSummaryCounts,
  parseSeedCliArgs,
  printSeedSummary,
  validateSeedPlan,
  SeedValidationError,
} from "../src/lib/seed";

async function main(): Promise<void> {
  loadEnvLocal();

  const options = parseSeedCliArgs();

  let plan;

  try {
    plan = validateSeedPlan(buildSeedPlan());
  } catch (error) {
    if (error instanceof SeedValidationError) {
      console.error(
        `Seed validation error [${error.entity}] [${error.stableKey}]: ${error.issues.join("; ")}`,
      );
      process.exit(1);
    }

    throw error;
  }

  const counts = getSeedSummaryCounts(plan);
  await connectDB();

  try {
    const operations = await executeSeed(plan, options);
    printSeedSummary(operations, counts, options.dryRun);

    if (!options.dryRun) {
      console.log("Seed completed successfully.");
    }

    process.exit(0);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown seed execution error.";
    console.error(message);
    process.exit(1);
  }
}

void main();
