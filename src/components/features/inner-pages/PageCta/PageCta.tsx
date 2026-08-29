import { Button } from "@/components/ui/Button";
import type { PageCtaContent } from "@/types/content";
import styles from "./PageCta.module.scss";

interface PageCtaProps {
  cta: PageCtaContent;
}

export function PageCta({ cta }: PageCtaProps) {
  return (
    <div className={styles.cta}>
      <Button href={cta.href}>{cta.label}</Button>
    </div>
  );
}
