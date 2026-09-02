import type { SiteConfig } from "@/types/content";
import type { FaqItem } from "@/types/homepage";
import type { Treatment } from "@/types/content";
import { getSiteUrl } from "@/lib/seo/constants";

export function buildPersonSchema(siteConfig: SiteConfig) {
  const siteUrl = getSiteUrl(siteConfig);

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.therapistName,
    jobTitle: "מלווה רגשית ורוחנית",
    worksFor: {
      "@type": "Organization",
      name: siteConfig.businessName,
      url: siteUrl,
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
    },
    areaServed: {
      "@type": "Country",
      name: "Israel",
    },
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
      description: "צרו קשר עם עוגן לנשימה",
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
