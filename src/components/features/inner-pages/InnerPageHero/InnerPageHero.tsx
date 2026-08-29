import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./InnerPageHero.module.scss";

interface InnerPageHeroProps {
  title: string;
  subtitle?: string;
}

export function InnerPageHero({ title, subtitle }: InnerPageHeroProps) {
  return (
    <header className={styles.hero}>
      <SectionHeading title={title} subtitle={subtitle} level={1} />
    </header>
  );
}
