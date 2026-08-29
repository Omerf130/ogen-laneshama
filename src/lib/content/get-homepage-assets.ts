import { homepageAssets } from "@/content/homepage/homepage.assets";
import type { HomepageAssets } from "@/types/homepage";

export async function getHomepageAssets(): Promise<HomepageAssets> {
  return homepageAssets;
}
