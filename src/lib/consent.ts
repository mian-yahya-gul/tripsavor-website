import { useSyncExternalStore } from "react";
import { createLocalStore } from "@/lib/localStore";

/** "" = not chosen yet. Essential cookies/storage (theme, language, saved searches) never need consent. */
export type Consent = "" | "all" | "essential";

const store = createLocalStore<Consent>("tripsavor:consent", "", (v) =>
  v === "all" || v === "essential" ? v : ""
);

export const setConsent = (c: Consent) => store.set(c);
export const getConsent = () => store.get();

export function useConsent(): Consent {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
}

/** Lets the footer's "Cookie settings" link reopen the banner. */
export function resetConsent() {
  store.set("");
}
