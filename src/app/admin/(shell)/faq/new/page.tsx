import type { Metadata } from "next";
import { FaqItemEditor } from "@/components/admin/cms/faq/FaqItemEditor";

export const metadata: Metadata = {
  title: "שאלה חדשה | ניהול עוגן",
  robots: { index: false, follow: false },
};

export default function AdminFaqNewPage() {
  return (
    <>
      <h1>שאלה חדשה</h1>
      <FaqItemEditor mode="create" />
    </>
  );
}
