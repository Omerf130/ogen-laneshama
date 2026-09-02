import type { Types } from "mongoose";

/** Optional SEO overrides for CMS-managed entities */
export interface SeoFields {
  title?: string;
  description?: string;
  ogImageMediaId?: Types.ObjectId | string;
}

/** Provider-agnostic media reference on content documents */
export interface MediaRef {
  mediaId?: Types.ObjectId | string;
  src?: string | null;
  alt: string;
}

export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "IN_PROGRESS"
  | "CLOSED"
  | "ARCHIVED";

export type ContentPageSlug =
  | "about"
  | "pregnancy-motherhood"
  | "contact"
  | "treatments";

export type ContentPageType =
  | "about"
  | "pregnancy"
  | "contact"
  | "treatments-index";

export const CONTENT_PAGE_SLUG_TYPE_MAP: Record<
  ContentPageSlug,
  ContentPageType
> = {
  about: "about",
  "pregnancy-motherhood": "pregnancy",
  contact: "contact",
  treatments: "treatments-index",
};
