import styles from "./Input.module.scss";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export function Input({ hasError, className, ...props }: InputProps) {
  const classes = [
    styles.field,
    hasError ? styles.hasError : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return <input className={classes} {...props} />;
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export function Textarea({ hasError, className, ...props }: TextareaProps) {
  const classes = [
    styles.field,
    styles.textarea,
    hasError ? styles.hasError : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return <textarea className={classes} {...props} />;
}
