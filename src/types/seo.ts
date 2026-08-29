export interface PageMetadata {
  path: string;
  title: string;
  description: string;
}

export type PageMetadataKey =
  | "home"
  | "about"
  | "treatments"
  | "treatmentPsychotherapy"
  | "treatmentAromaTouch"
  | "treatmentReiki"
  | "treatmentGuidance"
  | "pregnancyMotherhood"
  | "contact";
