import { existsSync } from "node:fs";
import { basename, resolve } from "node:path";

export const LOCAL_IMAGE_PROVIDER = "local";

/** Public paths mirrored from homepage section components (HeroSection, PregnancySpotlightSection). */
export const SEED_LOCAL_IMAGES = {
  homepageHero: {
    providerKey: "/images/homepage/hero-editorial.webp",
    mimeType: "image/webp",
  },
  homepagePregnancy: {
    providerKey: "/images/homepage/pregnancy-editorial.webp",
    mimeType: "image/webp",
  },
} as const;

export type SeedLocalImageKey = keyof typeof SEED_LOCAL_IMAGES;

export function getPublicFilePath(providerKey: string): string {
  return resolve(process.cwd(), "public", providerKey.replace(/^\//, ""));
}

export function assertLocalImageFilesExist(): void {
  for (const image of Object.values(SEED_LOCAL_IMAGES)) {
    const filePath = getPublicFilePath(image.providerKey);

    if (!existsSync(filePath)) {
      throw new Error(
        `Expected local image file missing for seed: ${image.providerKey}`,
      );
    }
  }
}

export function filenameFromProviderKey(providerKey: string): string {
  return basename(providerKey);
}
