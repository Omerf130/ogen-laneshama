import { homepageContent } from "@/content/homepage/homepage.data";
import { pageMetadata } from "@/content/pages/page-metadata";
import {
  CONTENT_PAGE_SEO_KEY,
  TREATMENT_SEO_KEY,
} from "@/lib/seo/static-seo-fallbacks";
import type { TreatmentSlug } from "@/types/content";
import type { RepositoryContentPageSlug } from "@/lib/db/repositories/constants";

/** Approved CP2 copy — single clinic in Ramat Yishai; valley = service area. */
export const CP2B = {
  homepage: {
    heroSubtitle: homepageContent.hero.subtitle,
    aboutPreviewSupportingCopy: homepageContent.aboutPreview.supportingCopy,
    seo: {
      title: pageMetadata.home.title,
      description: pageMetadata.home.description,
    },
  },
  about: {
    introductionLocationSuffix:
      " הקליניקה שלי נמצאת ברמת ישי, ואני מלווה נשים גם מעמק יזרעאל והסביבה.",
    seo: {
      title: pageMetadata.about.title,
      description: pageMetadata.about.description,
    },
  },
  treatmentsIndex: {
    introLocationSuffix: " הפגישות מתקיימות בקליניקה ברמת ישי.",
    seo: {
      title: pageMetadata.treatments.title,
      description: pageMetadata.treatments.description,
    },
  },
  contact: {
    introLocationSuffix:
      " הפגישות מתקיימות בקליניקה ברמת ישי, לנשים מהעמק יזרעאל והסביבה.",
    seo: {
      title: pageMetadata.contact.title,
      description: pageMetadata.contact.description,
    },
  },
  pregnancyMotherhood: {
    howSupportFirstItem:
      "ליווי פנים אל פנים בקליניקה ברמת ישי — לנשים מהעמק יזרעאל והסביבה.",
    seo: {
      title: pageMetadata.pregnancyMotherhood.title,
      description: pageMetadata.pregnancyMotherhood.description,
    },
  },
} as const;

export function seoForContentPageSlug(slug: RepositoryContentPageSlug): {
  title: string;
  description: string;
} {
  const key = CONTENT_PAGE_SEO_KEY[slug];
  return {
    title: pageMetadata[key].title,
    description: pageMetadata[key].description,
  };
}

export function seoForTreatmentSlug(slug: TreatmentSlug): {
  title: string;
  description: string;
} {
  const key = TREATMENT_SEO_KEY[slug];
  return {
    title: pageMetadata[key].title,
    description: pageMetadata[key].description,
  };
}

/** Seed-era values (pre-CP2) — safe to overwrite when matched exactly. */
export const LEGACY_SEED = {
  homepageHeroSubtitleBase:
    "מרחב בטוח לליווי רגשי ורוחני לנשים. כשמשהו כבד על הלב, לא צריך לעבור את זה לבד.",
  homepageAboutPreviewSupportingCopy:
    "אני מאמינה בכך. אני כאן כדי ללוות, להקשיב, וליצור מרחב בטוח לעבור דרך מה שמעלה.",
  homepageSeo: {
    title: "בית",
    description:
      "עוגן לנשימה — ליווי רגשי ורוחני לנשים. רחלי נגרין, פסיכותרפיה, רייקי, Aroma Touch והכוונה.",
  },
} as const;
