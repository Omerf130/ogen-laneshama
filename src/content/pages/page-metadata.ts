import type { PageMetadata, PageMetadataKey } from "@/types/seo";

export const pageMetadata: Record<PageMetadataKey, PageMetadata> = {
  home: {
    path: "/",
    title: "בית",
    description:
      "עוגן לנשימה — ליווי רגשי ורוחני לנשים. רחלי נגרין, פסיכותרפיה, רייקי, Aroma Touch והכוונה.",
  },
  about: {
    path: "/about",
    title: "אודות רחלי נגרין",
    description:
      "הכירו את רחלי נגרין — ליווי רגשי ורוחני לנשים, בגישה אישית, חמה ומכבדת.",
  },
  treatments: {
    path: "/treatments",
    title: "דרכי ליווי",
    description:
      "פסיכותרפיה, רייקי, Aroma Touch והכוונה — דרכים שונות לליווי רגשי לנשים, בהתאם למה שמתאים לך.",
  },
  treatmentPsychotherapy: {
    path: "/treatments/psychotherapy",
    title: "פסיכותרפיה וליווי רגשי",
    description:
      "ליווי רגשי ופסיכותרפיה לנשים — מרחב בטוח לעיבוד, תמיכה והקשבה. לא תחליף לטיפול רפואי.",
  },
  treatmentAromaTouch: {
    path: "/treatments/aroma-touch",
    title: "Aroma Touch",
    description:
      "טכניקת שמנים אתריים לרגיעה ואיזון — שירות משלים, לא תחליף לטיפול רפואי או פסיכולוגי.",
  },
  treatmentReiki: {
    path: "/treatments/reiki",
    title: "רייקי",
    description:
      "רייקי — גישה מרגיעה לתמיכה רגשית. שירות משלים, לא תחליף לטיפול רפואי או פסיכולוגי.",
  },
  treatmentGuidance: {
    path: "/treatments/guidance",
    title: "תקשור והכוונה",
    description:
      "הכוונה רוחנית עדינה בתוך מסגרת תומכת — לא תחליף לטיפול מקצועי.",
  },
  pregnancyMotherhood: {
    path: "/pregnancy-motherhood",
    title: "ליווי בדרך להריון ולאימהות",
    description:
      "תמיכה רגשית ורוחנית לנשים בדרך להריון, בהריון ובאימהות — ליווי אישי, לא טיפול פוריות.",
  },
  contact: {
    path: "/contact",
    title: "יצירת קשר",
    description:
      "צרו קשר עם רחלי נגרין — בואי נדבר, בקצב שנוח לך.",
  },
};
