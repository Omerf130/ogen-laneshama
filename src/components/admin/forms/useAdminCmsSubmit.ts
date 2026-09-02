"use client";

import { useActionState, useEffect, useTransition } from "react";
import {
  ADMIN_CMS_INITIAL_ACTION_STATE,
  type AdminCmsActionState,
} from "@/lib/admin/cms/action-state";

type CmsAction = (
  prevState: AdminCmsActionState,
  formData: FormData,
) => Promise<AdminCmsActionState>;

export function useAdminCmsSubmit(action: CmsAction) {
  const [state, formAction, isPending] = useActionState(
    action,
    ADMIN_CMS_INITIAL_ACTION_STATE,
  );
  const [, startTransition] = useTransition();

  const submit = (payload: unknown) => {
    const formData = new FormData();
    formData.set("payload", JSON.stringify(payload));
    startTransition(() => {
      formAction(formData);
    });
  };

  return { state, submit, isPending };
}

export function useAdminCmsFeedbackReset(
  state: AdminCmsActionState,
  onSuccess?: () => void,
) {
  useEffect(() => {
    if (state.success) {
      onSuccess?.();
    }
  }, [state.success, onSuccess]);
}
