import { assertLocalImageFilesExist } from "@/lib/seed/local-images";
import { buildContentPagePayloads } from "@/lib/seed/transforms/content-pages";
import { buildFaqItemPayloads } from "@/lib/seed/transforms/faqs";
import { buildHomepageSeedPayload } from "@/lib/seed/transforms/homepage";
import { buildMediaAssetDefinitions } from "@/lib/seed/transforms/media-assets";
import { buildSiteSettingsPayload } from "@/lib/seed/transforms/site-settings";
import {
  buildTreatmentPayloads,
  getExpectedTreatmentSlugs,
} from "@/lib/seed/transforms/treatments";
import type { ContentPageDocumentInput } from "@/lib/validation/content-page";
import type { FaqItemDocumentInput } from "@/lib/validation/faq";
import type { HomepageDocumentInput } from "@/lib/validation/homepage";
import type { MediaAssetDocumentInput } from "@/lib/validation/media";
import type { SiteSettingsInput } from "@/lib/validation/site-settings";
import type { TreatmentDocumentInput } from "@/lib/validation/treatment";
import type { SeedMediaAssetDefinition } from "@/lib/seed/transforms/media-assets";

export interface SeedPlan {
  siteSettings: SiteSettingsInput;
  homepage: HomepageDocumentInput;
  contentPages: ContentPageDocumentInput[];
  treatments: TreatmentDocumentInput[];
  faqItems: FaqItemDocumentInput[];
  mediaAssets: SeedMediaAssetDefinition[];
}

export interface SeedExpectedState {
  siteSettingsId: string;
  homepageId: string;
  contentPageSlugs: string[];
  treatmentSlugs: string[];
  faqIds: string[];
  mediaAssetProviderKeys: string[];
  processStepCount: number;
  whoIsItForItemCount: number;
}

export const SEED_SITE_SETTINGS_ID = "site";
export const SEED_HOMEPAGE_ID = "homepage";

export function buildSeedPlan(): SeedPlan {
  assertLocalImageFilesExist();

  const homepageSeed = buildHomepageSeedPayload();
  const mediaAssets = buildMediaAssetDefinitions(homepageSeed.mediaAltByProviderKey);

  return {
    siteSettings: buildSiteSettingsPayload(),
    homepage: homepageSeed.document,
    contentPages: buildContentPagePayloads(),
    treatments: buildTreatmentPayloads(),
    faqItems: buildFaqItemPayloads(),
    mediaAssets,
  };
}

export function getSeedExpectedState(plan: SeedPlan): SeedExpectedState {
  return {
    siteSettingsId: SEED_SITE_SETTINGS_ID,
    homepageId: SEED_HOMEPAGE_ID,
    contentPageSlugs: plan.contentPages.map((page) => page.slug),
    treatmentSlugs: getExpectedTreatmentSlugs(),
    faqIds: plan.faqItems.map((item) => item.id),
    mediaAssetProviderKeys: plan.mediaAssets.map((asset) => asset.providerKey),
    processStepCount: plan.homepage.content.process.steps.length,
    whoIsItForItemCount: plan.homepage.content.recognition.whoIsItFor.items.length,
  };
}

export function getSeedSummaryCounts(plan: SeedPlan): {
  contentPages: number;
  treatments: number;
  faqs: number;
  mediaAssets: number;
} {
  return {
    contentPages: plan.contentPages.length,
    treatments: plan.treatments.length,
    faqs: plan.faqItems.length,
    mediaAssets: plan.mediaAssets.length,
  };
}

export type { MediaAssetDocumentInput };
