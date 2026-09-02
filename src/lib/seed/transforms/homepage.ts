import { homepageContent } from "@/content/homepage/homepage.data";
import { SEED_LOCAL_IMAGES } from "@/lib/seed/local-images";
import type { HomepageDocumentInput } from "@/lib/validation/homepage";
import { seoFromMetadataKey } from "./seo";

export interface HomepageSeedPayload {
  document: HomepageDocumentInput;
  mediaAltByProviderKey: Record<string, string>;
}

export function buildHomepageSeedPayload(): HomepageSeedPayload {
  const heroPath = SEED_LOCAL_IMAGES.homepageHero.providerKey;
  const pregnancyPath = SEED_LOCAL_IMAGES.homepagePregnancy.providerKey;

  const mediaAltByProviderKey: Record<string, string> = {
    [heroPath]: homepageContent.hero.title,
    [pregnancyPath]: homepageContent.pregnancySpotlight.featuredStatement,
  };

  return {
    mediaAltByProviderKey,
    document: {
      content: structuredClone(homepageContent),
      assets: {
        hero: {
          src: heroPath,
          alt: mediaAltByProviderKey[heroPath],
        },
        pregnancySpotlight: {
          src: pregnancyPath,
          alt: mediaAltByProviderKey[pregnancyPath],
        },
      },
      seo: seoFromMetadataKey("home"),
    },
  };
}
