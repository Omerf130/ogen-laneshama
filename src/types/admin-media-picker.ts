import type { ContentImageFitMode, ContentImageObjectPosition } from "@/types/content";

export type AdminMediaPickerItem = {
  _id: string;
  url: string;
  alt: string;
  filename: string;
  provider: string;
};

export type AdminImageFieldValue = {
  src: string | null;
  alt: string;
  mediaId?: string;
  fitMode?: ContentImageFitMode;
  objectPosition?: ContentImageObjectPosition;
};
