import styles from "./MediaPlaceholder.module.scss";

interface MediaPlaceholderProps {
  label?: string;
  className?: string;
}

export function MediaPlaceholder({
  label = "תמונה תתווסף בשלב הבא",
  className,
}: MediaPlaceholderProps) {
  const classes = className
    ? `${styles.placeholder} ${className}`
    : styles.placeholder;

  return (
    <div className={classes} role="img" aria-label={label}>
      {label}
    </div>
  );
}
