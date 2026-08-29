import { homepageContent } from "@/content/homepage/homepage.data";
import type { HomepageContent } from "@/types/homepage";

export async function getHomepageContent(): Promise<HomepageContent> {
  return homepageContent;
}
