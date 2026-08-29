"use client";

import { useId, useState } from "react";
import type { FaqItem } from "@/types/homepage";
import styles from "./FaqAccordion.module.scss";

interface FaqAccordionProps {
  items: FaqItem[];
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <ul className={styles.list}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        const panelId = `${baseId}-${item.id}-panel`;
        const triggerId = `${baseId}-${item.id}-trigger`;

        return (
          <li key={item.id} className={styles.item}>
            <button
              type="button"
              id={triggerId}
              className={styles.trigger}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenId(isOpen ? null : item.id)}
            >
              <span>{item.question}</span>
              <span className={styles.icon} aria-hidden="true">
                {isOpen ? "−" : "+"}
              </span>
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className={`${styles.panel} ${isOpen ? styles.open : ""}`}
              hidden={!isOpen}
            >
              <p className={styles.answer}>{item.answer}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
