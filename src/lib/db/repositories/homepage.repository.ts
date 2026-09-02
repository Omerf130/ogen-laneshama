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

export async function findHomepageForAdmin(): Promise<HomepageLeanDocument | null> {
  return findHomepage();
}

export async function updateHomepage(
  input: HomepageDocumentInput,
): Promise<HomepageLeanDocument> {
  await ensureDbConnection();

  const doc = await HomepageModel.findByIdAndUpdate(
    HOMEPAGE_ID,
    {
      $set: {
        content: input.content,
        assets: input.assets,
        sectionVisibility: input.sectionVisibility,
        seo: input.seo,
      },
    },
    { new: true, upsert: false, runValidators: true },
  ).lean<HomepageLeanDocument>();

  if (!doc) {
    throw new Error("Homepage document not found");
  }

  return doc;
}
