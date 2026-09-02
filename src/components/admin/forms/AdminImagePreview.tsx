import styles from "./forms.module.scss";

type AdminImagePreviewProps = {
  label: string;
  src: string | null;
  alt?: string;
};

export function AdminImagePreview({ label, src, alt }: AdminImagePreviewProps) {
  return (
    <div className={styles.imagePreview}>
      <p className={styles.label}>{label}</p>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt ?? label} className={styles.imagePreviewImg} />
      ) : (
        <p className={styles.imagePreviewMeta}>אין תמונה מוגדרת</p>
      )}
      {alt ? <p className={styles.imagePreviewMeta}>טקסט חלופי: {alt}</p> : null}
      <p className={styles.imagePreviewNotice}>
        החלפת תמונות תתאפשר בשלב העלאת מדיה (בקרוב).
      </p>
    </div>
  );
}
