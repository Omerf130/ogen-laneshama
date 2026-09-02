import type { MediaAssetDocumentInput } from "@/lib/validation/media";
import {
  filenameFromProviderKey,
  LOCAL_IMAGE_PROVIDER,
  SEED_LOCAL_IMAGES,
} from "@/lib/seed/local-images";

export interface SeedMediaAssetDefinition {
  providerKey: string;
  alt: string;
  payload: MediaAssetDocumentInput;
}

export function buildMediaAssetDefinitions(
  altByProviderKey: Record<string, string>,
): SeedMediaAssetDefinition[] {
  return Object.values(SEED_LOCAL_IMAGES).map((image) => {
    const filename = filenameFromProviderKey(image.providerKey);
    const alt = altByProviderKey[image.providerKey];

    if (!alt) {
      throw new Error(
        `Missing alt text mapping for local image: ${image.providerKey}`,
      );
    }

    return {
      providerKey: image.providerKey,
      alt,
      payload: {
        originalFilename: filename,
        filename,
        alt,
        mimeType: image.mimeType,
        provider: LOCAL_IMAGE_PROVIDER,
        providerKey: image.providerKey,
        url: image.providerKey,
      },
    };
  });
}
