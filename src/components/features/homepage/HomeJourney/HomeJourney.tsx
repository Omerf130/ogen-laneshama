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
}

export function HomeJourney({
  content,
  treatments,
  faqItems,
  testimonials,
  assets,
  whatsAppUrl,
}: HomeJourneyProps) {
  const hasTestimonials = testimonials.some((t) => t.quote);

  return (
    <JourneyShell>
      <div className={styles.journey}>
        <main id="main-content" className={styles.main}>
          <HeroSection content={content.hero} whatsAppUrl={whatsAppUrl} />
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
          <PregnancySpotlightSection content={content.pregnancySpotlight} />
          <ProcessSection content={content.process} />
          {hasTestimonials ? (
            <TestimonialsSection
              content={content.testimonialsSection}
              testimonials={testimonials}
            />
          ) : null}
          <FaqSection content={content.faqSection} items={faqItems} />
          <ContactCtaSection
            content={content.contactCta}
            whatsAppUrl={whatsAppUrl}
          />
        </main>
      </div>
    </JourneyShell>
  );
}
