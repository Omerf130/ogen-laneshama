import {
  adminLeadUpdateSchema,
  contentPageDocumentSchema,
  exactlyFourProcessStepsSchema,
  exactlyFourWhoIsItForItemsSchema,
  homepageDocumentSchema,
  publicLeadInputSchema,
  siteSettingsSchema,
  treatmentDocumentSchema,
  treatmentSlugSchema,
} from "../src/lib/validation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function hasIndex(
  indexes: ReturnType<typeof import("mongoose").Schema.prototype.indexes>,
  keyPattern: Record<string, number>,
): boolean {
  return indexes.some(([keys]) => {
    const indexKeys = keys as Record<string, number>;

    return Object.entries(keyPattern).every(([field, direction]) => {
      return indexKeys[field] === direction;
    });
  });
}

async function verifyModels(): Promise<void> {
  const firstImport = await import("../src/lib/db/models/treatment.model");
  const secondImport = await import("../src/lib/db/models/treatment.model");
  const faqImport = await import("../src/lib/db/models/faq-item.model");
  const testimonialImport = await import("../src/lib/db/models/testimonial.model");
  const leadImport = await import("../src/lib/db/models/lead.model");
  const adminImport = await import("../src/lib/db/models/admin-user.model");

  assert(
    firstImport.TreatmentModel === secondImport.TreatmentModel,
    "TreatmentModel hot-reload registration failed",
  );

  const treatmentIndexes = firstImport.TreatmentModel.schema.indexes();
  assert(
    hasIndex(treatmentIndexes, { slug: 1 }),
    "Treatment slug unique index missing",
  );
  assert(
    hasIndex(treatmentIndexes, { isActive: 1, sortOrder: 1 }),
    "Treatment isActive/sortOrder index missing",
  );

  const faqIndexes = faqImport.FaqItemModel.schema.indexes();
  assert(
    hasIndex(faqIndexes, { isPublished: 1, sortOrder: 1 }),
    "FaqItem published/sortOrder index missing",
  );

  const testimonialIndexes = testimonialImport.TestimonialModel.schema.indexes();
  assert(
    hasIndex(testimonialIndexes, { isPublished: 1, sortOrder: 1 }),
    "Testimonial published/sortOrder index missing",
  );

  const leadIndexes = leadImport.LeadModel.schema.indexes();
  assert(
    hasIndex(leadIndexes, { status: 1, createdAt: -1 }),
    "Lead status/createdAt index missing",
  );
  assert(
    hasIndex(leadIndexes, { isRead: 1, createdAt: -1 }),
    "Lead isRead/createdAt index missing",
  );

  const adminUserIndexes = adminImport.AdminUserModel.schema.indexes();
  assert(
    hasIndex(adminUserIndexes, { email: 1 }),
    "AdminUser email unique index missing",
  );

  const passwordPath = adminImport.AdminUserModel.schema.path("passwordHash");
  assert(
    passwordPath?.options.select === false,
    "AdminUser passwordHash must be select:false",
  );

  console.log("Model registration and index checks passed.");
}

function verifyValidation(): void {
  const emptySiteSettings = siteSettingsSchema.safeParse({
    businessName: "עוגן לנשימה",
    therapistName: "רחלי נגרין",
    tagline: "מרחב בטוח",
    siteUrl: "https://example.com",
    contact: { phone: "", email: "", address: "" },
    whatsapp: { number: "", message: "" },
    socialLinks: [],
    mainNav: [{ label: "בית", href: "/" }],
    footer: {
      brandSentence: "מרחב בטוח",
      navItems: [{ label: "בית", href: "/" }],
    },
  });
  assert(
    emptySiteSettings.success,
    "Empty contact/social site settings must be valid",
  );

  const invalidSlug = treatmentSlugSchema.safeParse("Invalid Slug!");
  assert(!invalidSlug.success, "Invalid treatment slug must be rejected");

  const privilegedLeadInput = publicLeadInputSchema.safeParse({
    name: "Test",
    phone: "050",
    email: "test@example.com",
    message: "Hello",
    status: "CLOSED",
  });
  assert(
    !privilegedLeadInput.success,
    "Public lead input must reject privileged fields",
  );

  const adminLeadUpdate = adminLeadUpdateSchema.safeParse({
    status: "CONTACTED",
    isRead: true,
    internalNotes: "Called back",
  });
  assert(
    adminLeadUpdate.success,
    "Admin lead update schema must accept CRM fields",
  );

  const threeSteps = exactlyFourProcessStepsSchema.safeParse(
    Array.from({ length: 3 }, () => ({
      title: "Step",
      description: "Description",
    })),
  );
  assert(!threeSteps.success, "Process must require exactly 4 steps");

  const threeItems = exactlyFourWhoIsItForItemsSchema.safeParse([
    "one",
    "two",
    "three",
  ]);
  assert(!threeItems.success, "Who Is It For must require exactly 4 items");

  const mismatchedContentPage = contentPageDocumentSchema.safeParse({
    slug: "about",
    pageType: "pregnancy",
    content: {},
  });
  assert(
    !mismatchedContentPage.success,
    "Mismatched slug/pageType must be rejected",
  );

  const treatmentWithSeo = treatmentDocumentSchema.safeParse({
    slug: "psychotherapy",
    title: "Title",
    shortDescription: "Short",
    emotionalOpening: "Opening",
    whatItIs: { id: "what", body: "Body" },
    whoItSuits: { id: "who", body: "Body" },
    sessionProcess: { id: "process", body: "Body" },
    supportiveGoals: { id: "goals", body: "Body" },
    expectations: { id: "expect", body: "Body" },
    cta: { label: "CTA", href: "/contact" },
    image: { src: null, alt: "Alt" },
    layoutVariant: "standard",
    isActive: true,
    sortOrder: 0,
  });
  assert(treatmentWithSeo.success, "Treatment without SEO must be valid");

  assert(
    homepageDocumentSchema.safeParse({
      content: {
        hero: {
          eyebrow: "e",
          title: "t",
          subtitle: "s",
          ctaPrimary: "c",
        },
        recognition: {
          title: "t",
          subtitle: "s",
          supportingStatements: ["a"],
          featuredStatement: "f",
          whoIsItFor: {
            eyebrow: "e",
            titleLines: ["a", "b"],
            items: ["1", "2", "3", "4"],
          },
        },
        aboutPreview: {
          eyebrow: "e",
          title: "t",
          featuredStatement: "f",
          supportingCopy: "s",
          whyRacheli: { title: "t", points: ["p"] },
          ctaLabel: "c",
        },
        treatmentsPreview: {
          eyebrow: "e",
          title: "t",
          subtitle: "s",
          ctaLabel: "c",
        },
        pregnancySpotlight: {
          eyebrow: "e",
          featuredStatement: "f",
          excerpt: "e",
          disclaimer: "d",
          ctaLabel: "c",
        },
        process: {
          eyebrow: "e",
          title: "t",
          subtitle: "s",
          steps: Array.from({ length: 4 }, () => ({
            title: "Step",
            description: "Description",
          })),
        },
        testimonialsSection: { title: "t", subtitle: "s" },
        faqSection: { eyebrow: "e", title: "t", subtitle: "s" },
        contactCta: {
          eyebrow: "e",
          featuredStatement: "f",
          subtitle: "s",
          ctaLabel: "c",
        },
      },
    }).success,
    "Homepage document without SEO must be valid",
  );

  console.log("Validation boundary checks passed.");
}

async function main(): Promise<void> {
  await verifyModels();
  verifyValidation();
  console.log("Phase 4C verification passed.");
}

void main().catch((error) => {
  const message =
    error instanceof Error ? error.message : "Unknown verification error";
  console.error(`Phase 4C verification failed: ${message}`);
  process.exit(1);
});
