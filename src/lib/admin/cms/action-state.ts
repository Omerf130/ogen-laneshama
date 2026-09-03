export type AdminCmsActionState = {
  success?: string;
  error?: string;
  data?: {
    mediaId?: string;
    url?: string;
    alt?: string;
    filename?: string;
    provider?: string;
  };
};

export const ADMIN_CMS_INITIAL_ACTION_STATE: AdminCmsActionState = {};
