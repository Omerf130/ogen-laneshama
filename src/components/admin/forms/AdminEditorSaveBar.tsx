import { AdminActionFeedback } from "./AdminActionFeedback";
import styles from "./forms.module.scss";

type AdminEditorSaveBarProps = {
  isDirty: boolean;
  isPending: boolean;
  onSave: () => void;
  success?: string;
  error?: string;
};

export function AdminEditorSaveBar({
  isDirty,
  isPending,
  onSave,
  success,
  error,
}: AdminEditorSaveBarProps) {
  return (
    <div className={styles.saveBar} role="region" aria-label="שמירת שינויים">
      <AdminActionFeedback success={success} error={error} />
      <div className={styles.saveBarInner}>
        {isDirty ? (
          <p className={styles.dirtyNotice}>יש שינויים שלא נשמרו</p>
        ) : (
          <p className={styles.saveBarHint}>אין שינויים ממתינים לשמירה</p>
        )}
        <button
          type="button"
          className={styles.submit}
          onClick={onSave}
          disabled={!isDirty || isPending}
        >
          {isPending ? "שומר..." : "שמירת שינויים"}
        </button>
      </div>
    </div>
  );
}
