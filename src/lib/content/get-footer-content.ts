import { footerContent } from "@/content/navigation/footer.data";
import type { FooterContent } from "@/types/navigation";

export async function getFooterContent(): Promise<FooterContent> {
  return footerContent;
}
