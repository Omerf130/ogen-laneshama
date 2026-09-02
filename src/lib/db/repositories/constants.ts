export const SITE_SETTINGS_ID = "site";
export const HOMEPAGE_ID = "homepage";

export const ACTIVE_TREATMENTS_FILTER = { isActive: true } as const;
export const ACTIVE_TREATMENTS_SORT = { sortOrder: 1 as const };

export const PUBLISHED_FAQ_FILTER = { isPublished: true } as const;
export const PUBLISHED_FAQ_SORT = { sortOrder: 1 as const };

export const PUBLISHED_TESTIMONIAL_FILTER = { isPublished: true } as const;
export const PUBLISHED_TESTIMONIAL_SORT = { sortOrder: 1 as const };

export const CONTENT_PAGE_SLUGS = [
  "about",
  "pregnancy-motherhood",
  "contact",
  "treatments",
] as const;

export type RepositoryContentPageSlug = (typeof CONTENT_PAGE_SLUGS)[number];
