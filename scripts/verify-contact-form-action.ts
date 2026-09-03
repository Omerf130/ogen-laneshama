import { submitContactFormAction } from "../src/features/contact/submit-contact-form.action";
import { LeadModel } from "../src/lib/db/models/lead.model";
import { ensureDbConnection } from "../src/lib/db/repositories/shared";
import { loadEnvLocal } from "./lib/load-env-local";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function buildFormData(input: Record<string, string>): FormData {
  const formData = new FormData();

  for (const [key, value] of Object.entries(input)) {
    formData.set(key, value);
  }

  return formData;
}

async function countLeadsByEmail(email: string): Promise<number> {
  return LeadModel.countDocuments({ email }).exec();
}

async function main(): Promise<void> {
  loadEnvLocal();
  await ensureDbConnection();

  const testEmail = `contact-form-verify-${Date.now()}@example.com`;
  const beforeTotal = await LeadModel.countDocuments().exec();

  const successResult = await submitContactFormAction(
    {},
    buildFormData({
      name: "Verify User",
      phone: "050-1234567",
      email: testEmail,
      message: "Regression test message",
      website: "",
      formStartedAt: String(Date.now() - 5000),
    }),
  );

  assert(Boolean(successResult.success), `Expected success, got ${JSON.stringify(successResult)}`);
  assert(!successResult.error, "Success path must not return error");

  const afterSuccessTotal = await LeadModel.countDocuments().exec();
  assert(afterSuccessTotal === beforeTotal + 1, "Exactly one lead must be created on success");

  const created = await LeadModel.findOne({ email: testEmail }).lean();
  assert(created, "Created lead must exist");
  assert(created.status === "NEW", "Lead status must be NEW");
  assert(created.sourcePage === "/contact", "Lead sourcePage must be /contact");
  assert(created.userAgent == null, "userAgent must remain unset");
  assert(created.ipHash == null, "ipHash must remain unset");
  assert(created.sourceReferrer == null, "sourceReferrer must remain unset");

  const duplicateEmail = `contact-form-verify-duplicate-${Date.now()}@example.com`;
  const duplicateResult = await submitContactFormAction(
    {},
    buildFormData({
      name: "Verify User",
      phone: "050-1234567",
      email: duplicateEmail,
      message: "Second submission",
      website: "",
      formStartedAt: String(Date.now() - 5000),
    }),
  );

  assert(Boolean(duplicateResult.success), `Second valid submission must succeed: ${JSON.stringify(duplicateResult)}`);
  assert(
    (await LeadModel.countDocuments().exec()) === beforeTotal + 2,
    "Each successful submission creates exactly one lead",
  );

  const honeypotBefore = await LeadModel.countDocuments().exec();
  const honeypotResult = await submitContactFormAction(
    {},
    buildFormData({
      name: "Bot",
      phone: "050",
      email: "bot@example.com",
      message: "spam",
      website: "http://spam.example",
      formStartedAt: String(Date.now() - 5000),
    }),
  );

  assert(Boolean(honeypotResult.success), "Honeypot must return silent success");
  const honeypotAfter = await LeadModel.countDocuments().exec();
  assert(honeypotAfter === honeypotBefore, "Honeypot must not create a lead");

  const fastSubmitResult = await submitContactFormAction(
    {},
    buildFormData({
      name: "Fast Bot",
      phone: "050",
      email: "fast-bot@example.com",
      message: "too fast",
      website: "",
      formStartedAt: String(Date.now()),
    }),
  );

  assert(Boolean(fastSubmitResult.error), "Fast submit must return safe error");
  assert(!fastSubmitResult.success, "Fast submit must not succeed");
  assert(
    (await countLeadsByEmail("fast-bot@example.com")) === 0,
    "Fast submit must not create a lead",
  );

  const invalidResult = await submitContactFormAction(
    {},
    buildFormData({
      name: "",
      phone: "",
      email: "not-an-email",
      message: "",
      website: "",
      formStartedAt: String(Date.now() - 5000),
    }),
  );

  assert(Boolean(invalidResult.fieldErrors), "Invalid submission must return fieldErrors");
  assert(!invalidResult.success, "Invalid submission must not succeed");

  await LeadModel.deleteMany({
    email: {
      $in: [testEmail, duplicateEmail],
    },
  }).exec();

  console.log("verify-contact-form-action — all checks passed");
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
