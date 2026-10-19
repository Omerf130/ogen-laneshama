"use client";

import { useActionState, useEffect, useRef, useTransition } from "react";
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

/** Testable predicate for save-completion baseline sync. */
export function shouldSyncBaselineOnSaveComplete(
  wasPending: boolean,
  isPending: boolean,
  success: string | undefined,
): boolean {
  return wasPending && !isPending && Boolean(success);
}

/**
 * Resets dirty baseline once when a save transition completes successfully.
 * Avoids re-syncing while `success` stays set and the user keeps editing.
 */
export function useAdminBaselineOnSaveComplete<T>(
  isPending: boolean,
  success: string | undefined,
  values: T,
  resetBaseline: (nextValue: T) => void,
): void {
  const valuesRef = useRef(values);
  const wasPendingRef = useRef(false);

  useEffect(() => {
    valuesRef.current = values;
  }, [values]);

  useEffect(() => {
    if (
      shouldSyncBaselineOnSaveComplete(
        wasPendingRef.current,
        isPending,
        success,
      )
    ) {
      resetBaseline(valuesRef.current);
    }
    wasPendingRef.current = isPending;
  }, [isPending, success, resetBaseline]);
}

export function useAdminCmsFeedbackReset(
  state: AdminCmsActionState,
  onSuccess?: () => void,
) {
  const onSuccessRef = useRef(onSuccess);
  const previousSuccessRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);

  useEffect(() => {
    if (!state.success || state.success === previousSuccessRef.current) {
      return;
    }
    previousSuccessRef.current = state.success;
    onSuccessRef.current?.();
  }, [state.success]);
}
