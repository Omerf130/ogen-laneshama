import styles from "./BackgroundDecor.module.scss";

export function BackgroundDecor() {
  return (
    <div className={styles.decor} aria-hidden="true">
      <div className={`${styles.shape} ${styles.shapeWash}`} />
      <div className={`${styles.shape} ${styles.shapePrimary}`} />
      <div className={`${styles.shape} ${styles.shapeSecondary}`} />
      <div className={`${styles.shape} ${styles.shapeAccent}`} />
    </div>
  );
}
