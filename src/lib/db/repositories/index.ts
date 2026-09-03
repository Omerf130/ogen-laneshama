import "server-only";

export {
  SITE_SETTINGS_ID,
  HOMEPAGE_ID,
  ACTIVE_TREATMENTS_FILTER,
  ACTIVE_TREATMENTS_SORT,
  PUBLISHED_FAQ_FILTER,
  PUBLISHED_FAQ_SORT,
  PUBLISHED_TESTIMONIAL_FILTER,
  PUBLISHED_TESTIMONIAL_SORT,
  CONTENT_PAGE_SLUGS,
} from "./constants";
export type { RepositoryContentPageSlug } from "./constants";

export { ensureDbConnection } from "./shared";

export {
  findSiteSettings,
  findSiteSettingsForAdmin,
  updateSiteSettings,
  type SiteSettingsLeanDocument,
} from "./site-settings.repository";

export {
  findHomepage,
  findHomepageForAdmin,
  updateHomepage,
  type HomepageLeanDocument,
} from "./homepage.repository";

export {
  findContentPageBySlug,
  findContentPageForAdmin,
  updateContentPageBySlug,
  type ContentPageLeanDocument,
} from "./content-page.repository";

export {
  findActiveTreatments,
  findActiveTreatmentBySlug,
  findAllTreatmentsForAdmin,
  findTreatmentBySlugForAdmin,
  updateTreatmentBySlug,
  setTreatmentActive,
  updateTreatmentSortOrders,
  type TreatmentLeanDocument,
} from "./treatment.repository";

export {
  findPublishedFaqItems,
  findAllFaqItemsForAdmin,
  createFaqItem,
  updateFaqItemById,
  deleteFaqItemById,
  updateFaqItemSortOrders,
  setFaqItemPublished,
  countPublishedFaqItems,
  type FaqItemLeanDocument,
} from "./faq-item.repository";

export {
  findPublishedTestimonials,
  findAllTestimonialsForAdmin,
  createTestimonial,
  updateTestimonialById,
  deleteTestimonialById,
  updateTestimonialSortOrders,
  setTestimonialPublished,
  countPublishedTestimonials,
  type TestimonialLeanDocument,
} from "./testimonial.repository";

export {
  findMediaAssetsByIds,
  findMediaAssetByProviderKey,
  findMediaAssetById,
  findAllMediaAssetsForAdmin,
  createMediaAsset,
  updateMediaAssetAlt,
  deleteMediaAssetById,
  type MediaAssetLeanDocument,
} from "./media-asset.repository";

export {
  createLead,
  findLeadsForAdmin,
  findLeadByIdForAdmin,
  updateLeadById,
  type LeadLeanDocument,
} from "./lead.repository";

export {
  upsertHomepageVisitor,
  countHomepageVisitors,
  countHomepageVisitorsLast7Days,
  type HomepageVisitorLeanDocument,
} from "./homepage-visitor.repository";
