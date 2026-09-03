import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { publicContactFormSchema } from "../src/lib/validation/lead";
import {
  adminLeadArchiveActionSchema,
  adminLeadUpdateActionSchema,
} from "../src/lib/validation/admin-phase7";

const ROOT = join(__dirname, "..");

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function assertFile(relativePath: string): void {
  assert(existsSync(join(ROOT, relativePath)), `Missing required file: ${relativePath}`);
}

function assertFileContains(relativePath: string, needle: string): void {
  const content = readFileSync(join(ROOT, relativePath), "utf8");
  assert(content.includes(needle), `Expected "${needle}" in ${relativePath}`);
}

function assertFileNotContains(relativePath: string, needle: string): void {
  const content = readFileSync(join(ROOT, relativePath), "utf8");
  assert(!content.includes(needle), `Did not expect "${needle}" in ${relativePath}`);
}

function verifyPublicContactSchema(): void {
  const valid = publicContactFormSchema.safeParse({
    name: "Test User",
    phone: "050-0000000",
    email: "test@example.com",
    message: "Hello",
    website: "",
    formStartedAt: Date.now() - 5000,
  });
  assert(valid.success, "Valid contact form must pass");

  const honeypot = publicContactFormSchema.safeParse({
    name: "Bot",
    phone: "050",
    email: "bot@example.com",
    message: "spam",
    website: "http://spam.example",
  });
  assert(honeypot.success, "Honeypot field must pass schema for silent server-side discard");

  const missing = publicContactFormSchema.safeParse({
    name: "",
    phone: "",
    email: "not-an-email",
    message: "",
  });
  assert(!missing.success, "Invalid contact form must be rejected");
}

function verifyAdminLeadSchemas(): void {
  const update = adminLeadUpdateActionSchema.safeParse({
    leadId: "abc123",
    status: "CONTACTED",
    internalNotes: "Called back",
  });
  assert(update.success, "Admin lead update schema must accept valid payload");

  const archive = adminLeadArchiveActionSchema.safeParse({ leadId: "abc123" });
  assert(archive.success, "Admin lead archive schema must accept leadId");
}

function verifyLeadSurface(): void {
  assertFile("src/lib/db/repositories/lead.repository.ts");
  assertFile("src/features/contact/submit-contact-form.action.ts");
  assertFile("src/features/admin/leads/leads.actions.ts");
  assertFile("src/components/admin/leads/LeadsListManager.tsx");
  assertFile("src/components/admin/leads/LeadDetailEditor.tsx");
  assertFile("src/app/admin/(shell)/leads/page.tsx");
  assertFile("src/app/admin/(shell)/leads/[id]/page.tsx");

  assertFileContains("src/features/admin/leads/leads.actions.ts", "archiveLeadAction");
  assertFileContains("src/features/admin/leads/leads.actions.ts", "updateLeadAction");
  assertFileNotContains("src/features/admin/leads/leads.actions.ts", "deleteLead");

  assertFileContains(
    "src/features/contact/submit-contact-form.action.ts",
    'sourcePage: "/contact"',
  );
  assertFileContains("src/components/features/contact/ContactForm/ContactForm.tsx", "website");
}

function main(): void {
  verifyPublicContactSchema();
  verifyAdminLeadSchemas();
  verifyLeadSurface();
  console.log("admin:verify-leads — all checks passed");
}

main();
