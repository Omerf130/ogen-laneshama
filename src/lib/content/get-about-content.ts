import { aboutContent } from "@/content/pages/about.data";
import type { AboutContent } from "@/types/content";

export async function getAboutContent(): Promise<AboutContent> {
  return aboutContent;
}
