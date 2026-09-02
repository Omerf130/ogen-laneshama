import type { Metadata } from "next";
import { TestimonialItemEditor } from "@/components/admin/cms/testimonials/TestimonialItemEditor";

export const metadata: Metadata = {
  title: "המלצה חדשה | ניהול עוגן",
  robots: { index: false, follow: false },
};

export default function AdminTestimonialNewPage() {
  return (
    <>
      <h1>המלצה חדשה</h1>
      <TestimonialItemEditor mode="create" />
    </>
  );
}
