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
import { RecognitionSection } from "../sections/RecognitionSection";
import { SafetySection } from "../sections/SafetySection";
import { TestimonialsSection } from "../sections/TestimonialsSection";
import { TreatmentsPreviewSection } from "../sections/TreatmentsPreviewSection";
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
  return (
    <JourneyShell>
      <div className={styles.journey}>
        <main id="main-content" className={styles.main}>
          <HeroSection content={content.hero} whatsAppUrl={whatsAppUrl} />
          <RecognitionSection content={content.recognition} />
          <AboutPreviewSection
            content={content.aboutPreview}
            portraitSrc={assets.aboutPortrait}
          />
          <TreatmentsPreviewSection treatments={treatments} />
          <SafetySection
            pregnancy={content.pregnancySpotlight}
            safety={content.safety}
          />
          <TestimonialsSection testimonials={testimonials} />
          <FaqSection items={faqItems} />
          <ContactCtaSection
            content={content.contactCta}
            whatsAppUrl={whatsAppUrl}
          />
        </main>
      </div>
    </JourneyShell>
  );
}
