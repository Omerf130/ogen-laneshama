import type { PageMetadata, PageMetadataKey } from "@/types/seo";

export const pageMetadata: Record<PageMetadataKey, PageMetadata> = {
  home: {
    path: "/",
    title: "בית",
    description:
      "עוגן לנשמה — ליווי רגשי ורוחני לנשים. רחלי נגרין, פסיכותרפיה, רייקי, Aroma Touch והכוונה.",
  },
  about: {
    path: "/about",
    title: "אודות",
    description: "הכירו את רחלי נגרין — מטפלת בליווי רגשי ורוחני לנשים.",
  },
  treatments: {
    path: "/treatments",
    title: "טיפולים",
    description: "מגוון שירותי ליווי רגשי ורוחני — פסיכותרפיה, רייקי, Aroma Touch והכוונה.",
  },
  treatmentPsychotherapy: {
    path: "/treatments/psychotherapy",
    title: "פסיכותרפיה וליווי רגשי",
    description: "ליווי רגשי ופסיכותרפיה לנשים — מרחב בטוח לעיבוד ותמיכה.",
  },
  treatmentAromaTouch: {
    path: "/treatments/aroma-touch",
    title: "Aroma Touch",
    description: "טכניקת שמנים אתריים לרגיעה ואיזון — שירות משלים.",
  },
  treatmentReiki: {
    path: "/treatments/reiki",
    title: "רייקי",
    description: "רייקי — גישה מרגיעה לתמיכה רגשית. שירות משלים, לא תחליף לטיפול רפואי.",
  },
  treatmentGuidance: {
    path: "/treatments/guidance",
    title: "תקשור והכוונה",
    description: "הכוונה רוחנית עדינה בתוך מסגרת תומכת.",
  },
  pregnancyMotherhood: {
    path: "/pregnancy-motherhood",
    title: "ליווי בדרך להריון ולאימהות",
    description:
      "תמיכה רגשית ורוחנית לנשים בדרך להריון, בהריון ובאימהות — לא טיפול פוריות.",
  },
  contact: {
    path: "/contact",
    title: "יצירת קשר",
    description: "צרו קשר עם עוגן לנשמה — רחלי נגרין.",
  },
};
