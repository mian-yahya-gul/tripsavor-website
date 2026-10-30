"use client";

import { useCallback, useSyncExternalStore } from "react";
import { createLocalStore } from "@/lib/localStore";
import { ur } from "@/data/ur";

export type Lang = "en" | "ur";

// Same key the pre-paint ThemeScript reads, so lang/dir are right before hydration.
const store = createLocalStore<Lang>("tripsavor:lang", "en", (v) => (v === "ur" ? "ur" : "en"));

export function setLang(lang: Lang) {
  store.set(lang);
  document.documentElement.setAttribute("lang", lang);
  document.documentElement.setAttribute("dir", lang === "ur" ? "rtl" : "ltr");
}

export function useLang(): Lang {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
}

/** Translate by English source string; anything without an Urdu entry stays English. */
export function useT() {
  const lang = useLang();
  return useCallback((en: string) => (lang === "ur" ? (ur[en] ?? en) : en), [lang]);
}
