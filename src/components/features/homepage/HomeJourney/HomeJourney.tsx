import type { Treatment } from "@/types/content";
import type {
  FaqItem,
  HomepageAssets,
  HomepageContent,
  TestimonialSlot,
} from "@/types/homepage";
import { JourneyShell } from "../JourneyShell";
import { AboutPreviewSection } from "../sections/AboutPreviewSection";
import { ContactCtaSection } from "../sections/ContactCtaSection";
import { FaqSection } from "../sections/FaqSection";
import { HeroSection } from "../sections/HeroSection";
import { PregnancySpotlightSection } from "../sections/PregnancySpotlightSection";
import { ProcessSection } from "../sections/ProcessSection";
import { RecognitionSection } from "../sections/RecognitionSection";
import { TestimonialsSection } from "../sections/TestimonialsSection";
import { TreatmentsPreviewSection } from "../sections/TreatmentsPreviewSection";
import { WhoIsItForSection } from "../sections/WhoIsItForSection";
import styles from "./HomeJourney.module.scss";

interface HomeJourneyProps {
  content: HomepageContent;
  treatments: Treatment[];
  faqItems: FaqItem[];
  testimonials: TestimonialSlot[];
  assets: HomepageAssets;
  whatsAppUrl: string | null;
  sectionVisibility?: {
    faq?: boolean;
    testimonials?: boolean;
  };
}

export function HomeJourney({
  content,
  treatments,
  faqItems,
  testimonials,
  assets,
  whatsAppUrl,
  sectionVisibility,
}: HomeJourneyProps) {
  const hasTestimonials = testimonials.some((t) => t.quote);
  const showTestimonials =
    sectionVisibility?.testimonials !== false && hasTestimonials;
  const showFaq = sectionVisibility?.faq !== false;

  return (
    <JourneyShell>
      <div className={styles.journey}>
        <main id="main-content" className={styles.main}>
          <HeroSection
            content={content.hero}
            imageSrc={assets.hero}
            whatsAppUrl={whatsAppUrl}
          />
          <RecognitionSection content={content.recognition} />
          <WhoIsItForSection content={content.recognition.whoIsItFor} />
          <AboutPreviewSection
            content={content.aboutPreview}
            portraitSrc={assets.aboutPortrait}
          />
          <TreatmentsPreviewSection
            content={content.treatmentsPreview}
            treatments={treatments}
          />
          <PregnancySpotlightSection
            content={content.pregnancySpotlight}
            imageSrc={assets.pregnancySpotlight}
          />
          <ProcessSection content={content.process} />
          {showTestimonials ? (
            <TestimonialsSection
              content={content.testimonialsSection}
              testimonials={testimonials}
            />
          ) : null}
          {showFaq ? (
            <FaqSection content={content.faqSection} items={faqItems} />
          ) : null}
          <ContactCtaSection
            content={content.contactCta}
            whatsAppUrl={whatsAppUrl}
          />
        </main>
      </div>
    </JourneyShell>
  );
}
