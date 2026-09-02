import { ZodError } from "zod";
import type { SeedPlan } from "@/lib/seed/build-seed-plan";
import {
  contentPageDocumentSchema,
  faqItemDocumentSchema,
  homepageDocumentSchema,
  mediaAssetDocumentSchema,
  siteSettingsSchema,
  treatmentDocumentSchema,
} from "@/lib/validation";

export class SeedValidationError extends Error {
  constructor(
    public readonly entity: string,
    public readonly stableKey: string,
    public readonly issues: string[],
  ) {
    super(
      `Seed validation failed for ${entity} (${stableKey}): ${issues.join("; ")}`,
    );
    this.name = "SeedValidationError";
  }
}

function formatZodIssues(error: ZodError): string[] {
  return error.issues.map((issue) => {
    const path = issue.path.length > 0 ? issue.path.join(".") : "(root)";
    return `${path}: ${issue.message}`;
  });
}

function assertValid<T>(
  entity: string,
  stableKey: string,
  schema: { parse: (value: unknown) => T },
  value: unknown,
): T {
  try {
    return schema.parse(value);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new SeedValidationError(entity, stableKey, formatZodIssues(error));
    }

    throw error;
  }
}

export function validateSeedPlan(plan: SeedPlan): SeedPlan {
  assertValid("SiteSettings", "site", siteSettingsSchema, plan.siteSettings);
  assertValid("Homepage", "homepage", homepageDocumentSchema, plan.homepage);

  for (const page of plan.contentPages) {
    assertValid("ContentPage", page.slug, contentPageDocumentSchema, page);
  }

  for (const treatment of plan.treatments) {
    assertValid("Treatment", treatment.slug, treatmentDocumentSchema, treatment);
  }

  for (const faq of plan.faqItems) {
    assertValid("FaqItem", faq.id, faqItemDocumentSchema, faq);
  }

  for (const media of plan.mediaAssets) {
    assertValid(
      "MediaAsset",
      media.providerKey,
      mediaAssetDocumentSchema,
      media.payload,
    );
  }

  return plan;
}
