"use client";

import { useCallback, useMemo, useState } from "react";

function serializeSnapshot<T>(value: T): string {
  return JSON.stringify(value);
}

export function useAdminFormState<T>(initialValue: T) {
  const [baselineSnapshot, setBaselineSnapshot] = useState(() =>
    serializeSnapshot(initialValue),
  );
  const [values, setValues] = useState(initialValue);

  const isDirty = useMemo(
    () => serializeSnapshot(values) !== baselineSnapshot,
    [values, baselineSnapshot],
  );

  const resetBaseline = useCallback((nextValue: T = values) => {
    setBaselineSnapshot(serializeSnapshot(nextValue));
    setValues(nextValue);
  }, [values]);

  const setField = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));
  }, []);

  return {
    values,
    setValues,
    setField,
    isDirty,
    resetBaseline,
  };
}
