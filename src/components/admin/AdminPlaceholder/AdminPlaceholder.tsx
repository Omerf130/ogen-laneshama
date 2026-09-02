import styles from "./AdminPlaceholder.module.scss";

type AdminPlaceholderProps = {
  title: string;
  description?: string;
};

export function AdminPlaceholder({
  title,
  description,
}: AdminPlaceholderProps) {
  return (
    <section className={styles.card} aria-labelledby="admin-placeholder-title">
      <h1 id="admin-placeholder-title" className={styles.title}>
        {title}
      </h1>
      {description ? (
        <p className={styles.description}>{description}</p>
      ) : null}
      <p className={styles.notice}>ייושם בשלב הבא</p>
    </section>
  );
}
