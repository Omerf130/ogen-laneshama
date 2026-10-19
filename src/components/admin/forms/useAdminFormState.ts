"use client";

import { useCallback, useMemo, useState } from "react";

export function serializeAdminFormSnapshot<T>(value: T): string {
  return JSON.stringify(value);
}

export function useAdminFormState<T>(initialValue: T) {
  const [baselineSnapshot, setBaselineSnapshot] = useState(() =>
    serializeAdminFormSnapshot(initialValue),
  );
  const [values, setValues] = useState(initialValue);

  const isDirty = useMemo(
    () => serializeAdminFormSnapshot(values) !== baselineSnapshot,
    [values, baselineSnapshot],
  );

  const resetBaseline = useCallback((nextValue: T) => {
    setBaselineSnapshot(serializeAdminFormSnapshot(nextValue));
  }, []);

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
