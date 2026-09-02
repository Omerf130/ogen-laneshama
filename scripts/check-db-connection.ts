import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pingDatabase } from "../src/lib/db/mongoose";

function loadEnvLocal(): void {
  const envPath = resolve(process.cwd(), ".env.local");

  if (!existsSync(envPath)) {
    return;
  }

  const contents = readFileSync(envPath, "utf8");

  for (const line of contents.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

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