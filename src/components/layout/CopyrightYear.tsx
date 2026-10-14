"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** Current year on the client; falls back to the build year during prerender. */
export function CopyrightYear() {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => 2026,
  );
  return <>{year}</>;
}
