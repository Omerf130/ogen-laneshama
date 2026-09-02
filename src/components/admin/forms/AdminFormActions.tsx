import styles from "./forms.module.scss";

type AdminFormActionsProps = {
  isDirty: boolean;
  isPending: boolean;
  onSave: () => void;
};

export function AdminFormActions({
  isDirty,
  isPending,
  onSave,
}: AdminFormActionsProps) {
  return (
    <div className={styles.actions}>
      {isDirty ? (
        <p className={styles.dirtyNotice}>יש שינויים שלא נשמרו</p>
      ) : null}
      <button
        type="button"
        className={styles.submit}
        onClick={onSave}
        disabled={!isDirty || isPending}
      >
        {isPending ? "שומר..." : "שמירת שינויים"}
      </button>
    </div>
  );
}
