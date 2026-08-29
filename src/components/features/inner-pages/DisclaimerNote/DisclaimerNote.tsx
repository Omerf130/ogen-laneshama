import styles from "./DisclaimerNote.module.scss";

interface DisclaimerNoteProps {
  text: string;
}

export function DisclaimerNote({ text }: DisclaimerNoteProps) {
  return (
    <aside className={styles.note} aria-label="הערה חשובה">
      <p>{text}</p>
    </aside>
  );
}
