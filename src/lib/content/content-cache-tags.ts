import type { RepositoryContentPageSlug } from "@/lib/db/repositories/constants";
import type { TreatmentSlug } from "@/types/content";

export const CONTENT_CACHE_TAGS = {
  siteSettings: "site-settings",
  mainNavigation: "main-navigation",
  footer: "footer",
  homepage: "homepage",
  homepageAssets: "homepage-assets",
  homepageSeo: "homepage-seo",
  faq: "faq",
  testimonials: "testimonials",
  treatments: "treatments",
  sitemap: "sitemap",
} as const;

export function contentPageTag(slug: RepositoryContentPageSlug): string {
  return `content-page:${slug}`;
}

export function contentPageSeoTag(slug: RepositoryContentPageSlug): string {
  return `content-page-seo:${slug}`;
}

export function treatmentTag(slug: TreatmentSlug): string {
  return `treatment:${slug}`;
}

export function treatmentSeoTag(slug: TreatmentSlug): string {
  return `treatment-seo:${slug}`;
}
