import type { Metadata } from "next";
import { getHomepageSeo } from "@/lib/content/get-homepage-seo";
import { getSiteConfig } from "@/lib/content/get-site-config";
import { getFaqItems } from "@/lib/content/get-faq";
import { getHomepageAssets } from "@/lib/content/get-homepage-assets";
import { getHomepageContent } from "@/lib/content/get-homepage-content";
import { getTestimonials } from "@/lib/content/get-testimonials";
import { getTreatments } from "@/lib/content/get-treatments";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildWhatsAppUrl } from "@/lib/whatsapp/build-whatsapp-url";
import { HomeJourney } from "@/components/features/homepage/HomeJourney";

export async function generateMetadata(): Promise<Metadata> {
  const [seo, siteConfig] = await Promise.all([
    getHomepageSeo(),
    getSiteConfig(),
  ]);

  return buildPageMetadata(seo, { siteConfig, path: "/" });
}

export default async function HomePage() {
  const [
    content,
    treatments,
    faqItems,
    testimonials,
    assets,
    siteConfig,
  ] = await Promise.all([
    getHomepageContent(),
    getTreatments(),
    getFaqItems(),
    getTestimonials(),
    getHomepageAssets(),
    getSiteConfig(),
  ]);

  const whatsAppUrl = buildWhatsAppUrl(
    siteConfig.whatsapp.number,
    siteConfig.whatsapp.message,
  );

  return (
    <HomeJourney
      content={content}
      treatments={treatments}
      faqItems={faqItems}
      testimonials={testimonials}
      assets={assets}
      whatsAppUrl={whatsAppUrl}
    />
  );
}
