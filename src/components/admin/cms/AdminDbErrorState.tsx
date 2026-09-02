import styles from "./AdminDbErrorState.module.scss";

type AdminDbErrorStateProps = {
  title?: string;
  message?: string;
};

export function AdminDbErrorState({
  title = "לא ניתן לטעון את התוכן",
  message = "לא ניתן לטעון את התוכן מהמסד כרגע. נסו שוב מאוחר יותר.",
}: AdminDbErrorStateProps) {
  return (
    <section className={styles.card} role="alert">
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.message}>{message}</p>
    </section>
  );
}
