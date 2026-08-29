/**
 * Content guidelines for all site copy.
 * These rules must be respected in every phase — static content, CMS, and admin.
 *
 * - Never promise medical or psychological outcomes.
 * - Reiki, spiritual guidance, and similar services are complementary —
 *   not substitutes for medical or psychological treatment.
 * - Pregnancy/motherhood support is emotional and spiritual only —
 *   not fertility treatment and not a promise of pregnancy.
 */

export const contentGuidelines = {
  noMedicalOutcomes: true,
  complementaryServicesDisclaimer:
    "שירותים אלו משלימים ואינם תחליף לטיפול רפואי או פסיכולוגי.",
  pregnancySupportDisclaimer:
    "ליווי רגשי ורוחני בלבד — לא טיפול פוריות ולא הבטחה להריון.",
} as const;
