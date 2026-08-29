import type { Treatment } from "@/types/content";
import { contentGuidelines } from "@/content/content-guidelines";

export const treatments: Treatment[] = [
  {
    slug: "psychotherapy",
    title: "פסיכותרפיה וליווי רגשי",
    shortDescription: "מרחב בטוח לעיבוד רגשי וליווי אישי.",
    longDescription:
      "תוכן מפורט יתווסף בשלב הבא. השירות מציע ליווי רגשי ואינו מהווה הבטחה לתוצאות טיפוליות.",
    contentNote: contentGuidelines.noMedicalOutcomes
      ? "אין להבטיח תוצאות רפואיות או פסיכולוגיות."
      : undefined,
  },
  {
    slug: "aroma-touch",
    title: "Aroma Touch",
    shortDescription: "טכניקת שמנים אתריים לרגיעה ואיזון.",
    longDescription:
      "תוכן מפורט יתווסף בשלב הבא. השירות משלים ואינו תחליף לטיפול רפואי.",
    contentNote: contentGuidelines.complementaryServicesDisclaimer,
  },
  {
    slug: "reiki",
    title: "רייקי",
    shortDescription: "גישה מרגיעה לתמיכה רגשית ואנרגטית.",
    longDescription:
      "תוכן מפורט יתווסף בשלב הבא. רייקי הוא שירות משלים — לא תחליף לטיפול רפואי או פסיכולוגי.",
    contentNote: contentGuidelines.complementaryServicesDisclaimer,
  },
  {
    slug: "guidance",
    title: "תקשור והכוונה",
    shortDescription: "הכוונה רוחנית עדינה בתוך מסגרת תומכת.",
    longDescription:
      "תוכן מפורט יתווסף בשלב הבא. ההכוונה הרוחנית אינה מחליפה טיפול מקצועי.",
    contentNote: contentGuidelines.complementaryServicesDisclaimer,
  },
];
