import { pregnancyMotherhoodContent } from "@/content/pages/pregnancy-motherhood.data";
import type { PregnancyMotherhoodContent } from "@/types/content";

export async function getPregnancyMotherhoodContent(): Promise<PregnancyMotherhoodContent> {
  return pregnancyMotherhoodContent;
}
