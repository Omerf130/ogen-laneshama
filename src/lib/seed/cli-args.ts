export interface SeedCliOptions {
  dryRun: boolean;
  force: boolean;
  ackProduction: boolean;
}

export function parseSeedCliArgs(argv: string[] = process.argv.slice(2)): SeedCliOptions {
  return {
    dryRun: argv.includes("--dry-run"),
    force: argv.includes("--force"),
    ackProduction: argv.includes("--ack-production"),
  };
}

export function isProductionEnvironment(): boolean {
  return process.env.NODE_ENV === "production";
}
