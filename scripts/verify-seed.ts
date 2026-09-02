import { loadEnvLocal } from "./lib/load-env-local";
import { connectDB } from "../src/lib/db/mongoose";
import { AdminUserModel } from "../src/lib/db/models/admin-user.model";
import { ContentPageModel } from "../src/lib/db/models/content-page.model";
import { FaqItemModel } from "../src/lib/db/models/faq-item.model";
import { HomepageModel } from "../src/lib/db/models/homepage.model";
import { LeadModel } from "../src/lib/db/models/lead.model";
import { MediaAssetModel } from "../src/lib/db/models/media-asset.model";
import { SiteSettingsModel } from "../src/lib/db/models/site-settings.model";
import { TestimonialModel } from "../src/lib/db/models/testimonial.model";
import { TreatmentModel } from "../src/lib/db/models/treatment.model";
import {
  buildSeedPlan,
  getSeedExpectedState,
  validateSeedPlan,
} from "../src/lib/seed";
import { LOCAL_IMAGE_PROVIDER } from "../src/lib/seed/local-images";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

async function main(): Promise<void> {
  loadEnvLocal();
  await connectDB();

  const plan = validateSeedPlan(buildSeedPlan());
  const expected = getSeedExpectedState(plan);

  const siteSettingsCount = await SiteSettingsModel.countDocuments({
    _id: expected.siteSettingsId,
  });
  assert(siteSettingsCount === 1, "Expected exactly one SiteSettings singleton");

  const homepageCount = await HomepageModel.countDocuments({
    _id: expected.homepageId,
  });
  assert(homepageCount === 1, "Expected exactly one Homepage singleton");

  const contentPages = await ContentPageModel.find(
    { slug: { $in: expected.contentPageSlugs } },
    { slug: 1 },
  ).lean();

  assert(
    contentPages.length === expected.contentPageSlugs.length,
    `Expected ${expected.contentPageSlugs.length} ContentPage documents`,
  );

  for (const slug of expected.contentPageSlugs) {
    assert(
      contentPages.some((page) => page.slug === slug),
      `Missing ContentPage slug: ${slug}`,
    );
  }

  const treatments = await TreatmentModel.find(
    { slug: { $in: expected.treatmentSlugs } },
    { slug: 1, isActive: 1, sortOrder: 1 },
  )
    .sort({ sortOrder: 1 })
    .lean();

  assert(
    treatments.length === expected.treatmentSlugs.length,
    `Expected ${expected.treatmentSlugs.length} Treatment documents`,
  );

  treatments.forEach((treatment, index) => {
    assert(
      treatment.slug === expected.treatmentSlugs[index],
      `Treatment slug order mismatch at index ${index}`,
    );
    assert(treatment.isActive === true, `Treatment ${treatment.slug} is not active`);
    assert(
      treatment.sortOrder === index,
      `Treatment ${treatment.slug} sortOrder expected ${index}, got ${treatment.sortOrder}`,
    );
  });

  const faqItems = await FaqItemModel.find(
    { id: { $in: expected.faqIds } },
    { id: 1, sortOrder: 1 },
  )
    .sort({ sortOrder: 1 })
    .lean();

  assert(
    faqItems.length === expected.faqIds.length,
    `Expected ${expected.faqIds.length} FaqItem documents`,
  );

  faqItems.forEach((faq, index) => {
    assert(faq.id === expected.faqIds[index], `FAQ id order mismatch at index ${index}`);
    assert(faq.sortOrder === index, `FAQ ${faq.id} sortOrder expected ${index}`);
  });

  const testimonialCount = await TestimonialModel.countDocuments();
  assert(testimonialCount === 0, `Expected zero testimonials, found ${testimonialCount}`);

  const leadCount = await LeadModel.countDocuments();
  assert(leadCount === 0, `Expected zero leads, found ${leadCount}`);

  const adminUserCount = await AdminUserModel.countDocuments();
  assert(adminUserCount === 0, `Expected zero admin users, found ${adminUserCount}`);

  const mediaAssets = await MediaAssetModel.find({
    provider: LOCAL_IMAGE_PROVIDER,
    providerKey: { $in: expected.mediaAssetProviderKeys },
  }).lean();

  assert(
    mediaAssets.length === expected.mediaAssetProviderKeys.length,
    `Expected ${expected.mediaAssetProviderKeys.length} MediaAsset records`,
  );

  const providerKeys = mediaAssets.map((asset) => asset.providerKey);
  const uniqueProviderKeys = new Set(providerKeys);
  assert(
    uniqueProviderKeys.size === providerKeys.length,
    "Duplicate MediaAsset providerKey values detected",
  );

  const homepage = await HomepageModel.findById(expected.homepageId).lean();
  assert(homepage, "Homepage document not found");

  assert(
    homepage.content.process.steps.length === expected.processStepCount,
    `Homepage process steps expected ${expected.processStepCount}`,
  );
  assert(
    homepage.content.recognition.whoIsItFor.items.length ===
      expected.whoIsItForItemCount,
    `Homepage who-is-it-for items expected ${expected.whoIsItForItemCount}`,
  );
  assert(expected.processStepCount === 4, "Expected exactly 4 homepage process steps");
  assert(
    expected.whoIsItForItemCount === 4,
    "Expected exactly 4 homepage who-is-it-for items",
  );

  console.log("Post-seed verification passed.");
  process.exit(0);
}

void main().catch((error: unknown) => {
  const message =
    error instanceof Error ? error.message : "Unknown verification error.";
  console.error(`Post-seed verification failed: ${message}`);
  process.exit(1);
});
