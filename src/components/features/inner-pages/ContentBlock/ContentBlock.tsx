import type { ContentBlock as ContentBlockType } from "@/types/content";
import styles from "./ContentBlock.module.scss";

interface ContentBlockProps {
  block: ContentBlockType;
  headingLevel?: 2 | 3;
}

function renderBody(body: string | string[]) {
  if (typeof body === "string") {
    return <p>{body}</p>;
  }

  return (
    <ul>
      {body.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function ContentBlock({ block, headingLevel = 2 }: ContentBlockProps) {
  const HeadingTag = headingLevel === 2 ? "h2" : "h3";
  const variantClass =
    block.variant === "emphasis"
      ? styles.emphasis
      : block.variant === "aside"
        ? styles.aside
        : styles.default;

  return (
    <section
      id={block.id}
      className={variantClass}
      aria-labelledby={block.title ? `${block.id}-heading` : undefined}
    >
      {block.title ? (
        <HeadingTag id={`${block.id}-heading`} className={styles.title}>
          {block.title}
        </HeadingTag>
      ) : null}
      <div className={styles.prose}>{renderBody(block.body)}</div>
    </section>
  );
}
