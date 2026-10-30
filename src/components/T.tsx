"use client";

import { useT } from "@/lib/i18n";

/** Inline translation for text inside server components: <T>Search Flights</T> */
export default function T({ children }: { children: string }) {
  const t = useT();
  return <>{t(children)}</>;
}
