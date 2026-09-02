import "server-only";

export { MapperValidationError, parseWithMapperValidation } from "./errors";

export {
  buildMediaAssetMap,
  collectMediaIdsFromRefs,
  resolveMediaRefToPublicSrc,
  resolveMediaRefToContentImage,
  type MediaAssetMap,
} from "./media-resolver";

export { mapSiteSettingsToSiteConfig } from "./to-site-config";

export {
  mapSiteSettingsToMainNav,
  filterTestimonialsNavItem,
  TESTIMONIALS_NAV_HREF,
} from "./to-main-nav";

export { mapSiteSettingsToFooterContent } from "./to-footer-content";

export { mapHomepageToHomepageContent } from "./to-homepage-content";

export {
  collectHomepageAssetMediaIds,
  mapHomepageToHomepageAssets,
} from "./to-homepage-assets";

export {
  mapContentPageToAboutContent,
  mapContentPageToPregnancyMotherhoodContent,
  mapContentPageToContactPageContent,
  mapContentPageToTreatmentsIndexContent,
} from "./to-content-page";

export {
  mapTreatmentDocumentToTreatment,
  mapTreatmentDocumentsToTreatments,
} from "./to-treatment";

export {
  mapFaqItemDocumentToFaqItem,
  mapFaqItemDocumentsToFaqItems,
} from "./to-faq-item";

export {
  mapTestimonialDocumentToTestimonialSlot,
  mapTestimonialDocumentsToTestimonialSlots,
} from "./to-testimonial-slot";
