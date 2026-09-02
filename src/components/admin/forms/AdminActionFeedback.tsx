import styles from "./forms.module.scss";

type AdminActionFeedbackProps = {
  success?: string;
  error?: string;
};

export function AdminActionFeedback({ success, error }: AdminActionFeedbackProps) {
  if (!success && !error) {
    return null;
  }

  return (
    <>
      {success ? (
        <p className={styles.feedbackSuccess} role="status">
          {success}
        </p>
      ) : null}
      {error ? (
        <p className={styles.feedbackError} role="alert">
          {error}
        </p>
      ) : null}
    </>
  );
}
