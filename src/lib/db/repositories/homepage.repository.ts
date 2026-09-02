import { HomepageModel } from "@/lib/db/models/homepage.model";
import { HOMEPAGE_ID } from "@/lib/db/repositories/constants";
import { ensureDbConnection } from "@/lib/db/repositories/shared";
import type { HomepageDocumentInput } from "@/lib/validation/homepage";

export interface HomepageLeanDocument {
  _id: string;
  content: HomepageDocumentInput["content"];
  assets?: HomepageDocumentInput["assets"];
  sectionVisibility?: HomepageDocumentInput["sectionVisibility"];
  seo?: HomepageDocumentInput["seo"];
  createdAt?: Date;
  updatedAt?: Date;
}

export async function findHomepage(): Promise<HomepageLeanDocument | null> {
  await ensureDbConnection();

  return HomepageModel.findById(HOMEPAGE_ID).lean<HomepageLeanDocument>().exec();
}
