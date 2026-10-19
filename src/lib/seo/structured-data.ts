import type { SiteConfig } from "@/types/content";
import type { FaqItem } from "@/types/homepage";
import type { Treatment } from "@/types/content";
import { getSiteUrl } from "@/lib/seo/constants";

/** Confirmed clinic geography — no street address or contact details. */
const CLINIC_CITY = "רמת ישי";
const SERVICE_REGION = "עמק יזרעאל";

function buildClinicPlaceSchema() {
  return {
    "@type": "Place",
    name: CLINIC_CITY,
    containedInPlace: {
      "@type": "AdministrativeArea",
      name: SERVICE_REGION,
    },
  };
}

function buildConfirmedServiceAreaSchema() {
  return [
    { "@type": "City", name: CLINIC_CITY },
    { "@type": "AdministrativeArea", name: SERVICE_REGION },
    { "@type": "Country", name: "Israel" },
  ];
}

export function buildPersonSchema(siteConfig: SiteConfig) {
  const siteUrl = getSiteUrl(siteConfig);

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.therapistName,
    jobTitle: "מלווה רגשית ורוחנית",
    workLocation: buildClinicPlaceSchema(),
    worksFor: {
      "@type": "Organization",
      name: siteConfig.businessName,
      url: siteUrl,
      location: buildClinicPlaceSchema(),
    },
    url: `${siteUrl}/about`,
  };
}

export function buildWebPageSchema(
  siteConfig: SiteConfig,
  options: {
    name: string;
    description: string;
    path: string;
  },
) {
  const siteUrl = getSiteUrl(siteConfig);

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: options.name,
    description: options.description,
    url: `${siteUrl}${options.path}`,
    inLanguage: "he-IL",
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.businessName,
      url: siteUrl,
    },
  };
}

export function buildServiceSchema(
  siteConfig: SiteConfig,
  treatment: Treatment,
) {
  const siteUrl = getSiteUrl(siteConfig);

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: treatment.title,
    description: treatment.shortDescription,
    url: `${siteUrl}/treatments/${treatment.slug}`,
    provider: {
      "@type": "Person",
      name: siteConfig.therapistName,
      workLocation: buildClinicPlaceSchema(),
    },
    areaServed: buildConfirmedServiceAreaSchema(),
  };
}

export function buildFaqPageSchema(items: FaqItem[]) {
  if (items.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildContactPageSchema(siteConfig: SiteConfig) {
  const siteUrl = getSiteUrl(siteConfig);
  const hasContact = Boolean(
    siteConfig.contact.phone ||
      siteConfig.contact.email ||
      siteConfig.contact.address,
  );

  if (!hasContact) {
    return buildWebPageSchema(siteConfig, {
      name: "יצירת קשר",
      description: `צרו קשר עם ${siteConfig.businessName}`,
      path: "/contact",
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "יצירת קשר",
    url: `${siteUrl}/contact`,
    ...(siteConfig.contact.phone
      ? { telephone: siteConfig.contact.phone }
      : {}),
    ...(siteConfig.contact.email ? { email: siteConfig.contact.email } : {}),
  };
}
