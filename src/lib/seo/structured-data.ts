import { siteConfig } from "@/content/site.config";
import { SITE_URL } from "@/lib/seo/constants";
import type { FaqItem } from "@/types/homepage";
import type { Treatment } from "@/types/content";

export function buildPersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.therapistName,
    jobTitle: "מלווה רגשית ורוחנית",
    worksFor: {
      "@type": "Organization",
      name: siteConfig.businessName,
      url: SITE_URL,
    },
    url: `${SITE_URL}/about`,
  };
}

export function buildWebPageSchema(options: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: options.name,
    description: options.description,
    url: `${SITE_URL}${options.path}`,
    inLanguage: "he-IL",
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.businessName,
      url: SITE_URL,
    },
  };
}

export function buildServiceSchema(treatment: Treatment) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: treatment.title,
    description: treatment.shortDescription,
    url: `${SITE_URL}/treatments/${treatment.slug}`,
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

export function buildContactPageSchema() {
  const hasContact = Boolean(
    siteConfig.contact.phone ||
      siteConfig.contact.email ||
      siteConfig.contact.address,
  );

  if (!hasContact) {
    return buildWebPageSchema({
      name: "יצירת קשר",
      description: "צרו קשר עם עוגן לנשימה",
      path: "/contact",
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "יצירת קשר",
    url: `${SITE_URL}/contact`,
    ...(siteConfig.contact.phone
      ? { telephone: siteConfig.contact.phone }
      : {}),
    ...(siteConfig.contact.email ? { email: siteConfig.contact.email } : {}),
  };
}
