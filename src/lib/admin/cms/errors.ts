import "server-only";

export class AdminCmsDbError extends Error {
  constructor(message = "לא ניתן לטעון את התוכן מהמסד כרגע") {
    super(message);
    this.name = "AdminCmsDbError";
  }
}

export const ADMIN_CMS_GENERIC_ERROR =
  "לא ניתן לבצע את הפעולה כרגע. נסו שוב מאוחר יותר";

export const ADMIN_CMS_VALIDATION_ERROR =
  "הנתונים שהוזנו אינם תקינים";

export const ADMIN_CMS_SAVE_SUCCESS = "השינויים נשמרו בהצלחה";
