import { Container } from "@/components/ui/Container";
import type { HomepageWhoIsItFor } from "@/types/homepage";
import { WhoIsItForTile } from "../ui/WhoIsItForTile/WhoIsItForTile";
import styles from "./WhoIsItForSection.module.scss";

interface WhoIsItForSectionProps {
  content: HomepageWhoIsItFor;
}

const TILE_VARIANTS = ["a", "b", "c", "d"] as const;

export function WhoIsItForSection({ content }: WhoIsItForSectionProps) {
  return (
    <section id="who-is-it-for" className={styles.section}>
      <Container>
        <div className={styles.layout}>
          <header className={styles.header}>
            <p className={styles.eyebrow}>{content.eyebrow}</p>
            <h2 className={styles.title}>
              <span className={styles.titleLine}>{content.titleLines[0]}</span>
              <span className={styles.titleLine}>{content.titleLines[1]}</span>
            </h2>
          </header>

          <div className={styles.tiles}>
            {content.items.map((item, index) => (
              <WhoIsItForTile
                key={item}
                index={index}
                variant={TILE_VARIANTS[index] ?? "a"}
              >
                {item}
              </WhoIsItForTile>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
