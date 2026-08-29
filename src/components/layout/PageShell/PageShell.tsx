import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import styles from "./PageShell.module.scss";

interface PageShellProps {
  children: ReactNode;
}

export function PageShell({ children }: PageShellProps) {
  return (
    <main id="main-content" className={styles.shell}>
      <Container>
        <div className={styles.content}>{children}</div>
      </Container>
    </main>
  );
}
