import "server-only";

import { revalidatePath, revalidateTag } from "next/cache";
import { isDbContentSource } from "@/lib/content/content-source";
import {
  CONTENT_CACHE_TAGS,
  contentPageSeoTag,
  contentPageTag,
  treatmentSeoTag,
  treatmentTag,
} from "@/lib/content/content-cache-tags";
import type { RepositoryContentPageSlug } from "@/lib/db/repositories/constants";
import type { TreatmentSlug } from "@/types/content";

export type InvalidateContentDomain =
  | "site-settings"
  | "homepage"
  | "homepage-assets"
  | "content-page"
  | "treatment"
  | "faq"
  | "testimonials"
  | "media-asset"
  | "sitemap";

const CONTENT_PAGE_PATHS: Record<RepositoryContentPageSlug, string> = {
  about: "/about",
  "pregnancy-motherhood": "/pregnancy-motherhood",
  contact: "/contact",
  treatments: "/treatments",
};

function revalidateTags(tags: string[]): void {
  for (const tag of tags) {
    revalidateTag(tag, "max");
  }
}

export async function invalidateContent(input: {
  domain: InvalidateContentDomain;
  slug?: string;
  paths?: string[];
}): Promise<void> {
  if (!isDbContentSource()) {
    console.warn(
      JSON.stringify({
        event: "invalidate_content_skipped",
        reason: "static_content_source",
        domain: input.domain,
        slug: input.slug,
      }),
    );
    return;
  }

  switch (input.domain) {
    case "site-settings":
      revalidateTags([
        CONTENT_CACHE_TAGS.siteSettings,
        CONTENT_CACHE_TAGS.mainNavigation,
        CONTENT_CACHE_TAGS.footer,
        CONTENT_CACHE_TAGS.homepageSeo,
        CONTENT_CACHE_TAGS.sitemap,
      ]);
      revalidatePath("/", "layout");
      break;

    case "homepage":
      revalidateTags([
        CONTENT_CACHE_TAGS.homepage,
        CONTENT_CACHE_TAGS.homepageAssets,
        CONTENT_CACHE_TAGS.homepageSeo,
        CONTENT_CACHE_TAGS.sitemap,
      ]);
      revalidatePath("/");
      break;

    case "homepage-assets":
      revalidateTag(CONTENT_CACHE_TAGS.homepageAssets, "max");
      revalidatePath("/");
      break;

    case "content-page": {
      const slug = input.slug as RepositoryContentPageSlug | undefined;

      if (!slug) {
        throw new Error("invalidateContent content-page requires slug");
      }

      revalidateTags([
        contentPageTag(slug),
        contentPageSeoTag(slug),
        CONTENT_CACHE_TAGS.sitemap,
      ]);
      revalidatePath(CONTENT_PAGE_PATHS[slug]);
      break;
    }

    case "treatment": {
      const slug = input.slug as TreatmentSlug | undefined;

      if (!slug) {
        throw new Error("invalidateContent treatment requires slug");
      }

      revalidateTags([
        CONTENT_CACHE_TAGS.treatments,
        treatmentTag(slug),
        treatmentSeoTag(slug),
        CONTENT_CACHE_TAGS.sitemap,
      ]);
      revalidatePath("/");
      revalidatePath("/treatments");
      revalidatePath(`/treatments/${slug}`);
      break;
    }

    case "faq":
      revalidateTags([CONTENT_CACHE_TAGS.faq, CONTENT_CACHE_TAGS.sitemap]);
      revalidatePath("/");
      break;

    case "testimonials":
      revalidateTags([
        CONTENT_CACHE_TAGS.testimonials,
        CONTENT_CACHE_TAGS.mainNavigation,
        CONTENT_CACHE_TAGS.sitemap,
      ]);
      revalidatePath("/");
      revalidatePath("/", "layout");
      break;

    case "media-asset":
      revalidateTag(CONTENT_CACHE_TAGS.homepageAssets, "max");

      if (input.paths) {
        for (const path of input.paths) {
          revalidatePath(path);
        }
      }
      break;

    case "sitemap":
      revalidateTag(CONTENT_CACHE_TAGS.sitemap, "max");
      break;

    default: {
      const exhaustive: never = input.domain;
      throw new Error(`Unknown invalidate domain: ${String(exhaustive)}`);
    }
  }
}
