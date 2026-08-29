import { SectionHeading } from "@/components/ui/SectionHeading";
import { JourneySection } from "../JourneySection";
import { FaqAccordion } from "../ui/FaqAccordion";
import type { FaqItem } from "@/types/homepage";

interface FaqSectionProps {
  items: FaqItem[];
}

export function FaqSection({ items }: FaqSectionProps) {
  return (
    <JourneySection id="faq" stage="faq">
      <SectionHeading
        title="שאלות נפוצות"
        subtitle="תשובות לשאלות שנשים לעיתים שואלות לפני שיחה ראשונה."
        level={2}
      />
      <FaqAccordion items={items} />
    </JourneySection>
  );
}
