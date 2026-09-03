import { execSync } from "node:child_process";
import { join } from "node:path";

const ROOT = join(__dirname, "..");
const TSX = "tsx --require ./scripts/lib/register-server-only-stub.cjs";

const scripts = [
  `${TSX} scripts/verify-admin-leads.ts`,
  `${TSX} scripts/verify-contact-form-action.ts`,
  `${TSX} scripts/verify-admin-media.ts`,
  `${TSX} scripts/verify-analytics.ts`,
];

function main(): void {
  for (const command of scripts) {
    execSync(command, { cwd: ROOT, stdio: "inherit" });
  }

  console.log("verify:phase-7 — all checks passed");
}

main();
