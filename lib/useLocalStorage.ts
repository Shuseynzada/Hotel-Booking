"use client";

import { useEffect, useState } from "react";

type StoredValue<T> = {
  value: T;
  expiresAt: number;
};

export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  ttlMs: number
) {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return;

      const parsed = JSON.parse(raw) as StoredValue<T>;
      if (!parsed || typeof parsed !== "object" || parsed.value === undefined) {
        return;
      }

      if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
        window.localStorage.removeItem(key);
        return;
      }

      setValue(parsed.value);
    } catch {
      // ignore corrupted data
    }
  }, [key]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const payload: StoredValue<T> = {
      value,
      expiresAt: Date.now() + ttlMs,
    };

    try {
      window.localStorage.setItem(key, JSON.stringify(payload));
    } catch {
      // ignore quota/storage errors
    }
  }, [key, ttlMs, value]);

  return [value, setValue] as const;
}
