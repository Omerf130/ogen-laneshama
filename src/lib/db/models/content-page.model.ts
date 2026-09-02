import { Schema, type InferSchemaType } from "mongoose";
import { CONTENT_PAGE_SLUG_TYPE_MAP } from "@/types/db/persistence";
import { seoFieldsSchema, timestampsOptions } from "@/lib/db/schemas/shared";
import { registerModel } from "./register-model";

const contentPageSchema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      trim: true,
      enum: ["about", "pregnancy-motherhood", "contact", "treatments"],
      unique: true,
    },
    pageType: {
      type: String,
      required: true,
      enum: ["about", "pregnancy", "contact", "treatments-index"],
    },
    content: { type: Schema.Types.Mixed, required: true },
    seo: { type: seoFieldsSchema, default: undefined },
  },
  timestampsOptions,
);

contentPageSchema.pre("validate", function validateSlugPageType() {
  const expectedPageType =
    CONTENT_PAGE_SLUG_TYPE_MAP[
      this.slug as keyof typeof CONTENT_PAGE_SLUG_TYPE_MAP
    ];

  if (expectedPageType && this.pageType !== expectedPageType) {
    throw new Error(
      `slug "${String(this.slug)}" requires pageType "${expectedPageType}"`,
    );
  }
});

export type ContentPageDocument = InferSchemaType<typeof contentPageSchema>;

export const ContentPageModel = registerModel("ContentPage", contentPageSchema);
