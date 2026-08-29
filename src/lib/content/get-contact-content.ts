import { contactPageContent } from "@/content/pages/contact.data";
import type { ContactPageContent } from "@/types/content";

export async function getContactPageContent(): Promise<ContactPageContent> {
  return contactPageContent;
}
