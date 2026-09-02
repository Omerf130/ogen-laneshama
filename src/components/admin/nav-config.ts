export type AdminNavItem = {
  href: string;
  label: string;
};

export type AdminNavSection = {
  title?: string;
  items: AdminNavItem[];
};

export const adminNavSections: AdminNavSection[] = [
  {
    items: [{ href: "/admin", label: "לוח בקרה" }],
  },
  {
    title: "תוכן",
    items: [
      { href: "/admin/content/homepage", label: "דף הבית" },
      { href: "/admin/content/about", label: "אודות" },
      {
        href: "/admin/content/pregnancy-motherhood",
        label: "הריון ואימהות",
      },
      { href: "/admin/content/contact", label: "צור קשר" },
      { href: "/admin/content/treatments", label: "עמוד טיפולים" },
    ],
  },
  {
    items: [
      { href: "/admin/treatments", label: "טיפולים" },
      { href: "/admin/faq", label: "שאלות נפוצות" },
      { href: "/admin/testimonials", label: "המלצות" },
      { href: "/admin/leads", label: "פניות" },
      { href: "/admin/media", label: "מדיה" },
      { href: "/admin/settings", label: "הגדרות" },
    ],
  },
];
