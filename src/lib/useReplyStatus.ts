"use client";

import { useSyncExternalStore } from "react";
import { isAgentsOnline, replyEstimate } from "@/lib/whatsapp";

/**
 * isAgentsOnline/replyEstimate depend on the viewer's clock. Components that
 * render on statically generated pages (the homepage, the Umrah calculator)
 * must not call them directly during render — that bakes whatever hour
 * `next build` ran at into the page for every visitor until the next
 * deploy. This hook resolves to null on the server/first paint and swaps in
 * the live status once mounted, the same server-vs-client-snapshot pattern
 * used for currency and other local-only state elsewhere in this codebase.
 *
 * Split into its own "use client" module so plain helpers in lib/whatsapp.ts
 * stay importable from Server Components (e.g. group-tickets, manage-booking)
 * without dragging useSyncExternalStore into their bundle.
 */
type ReplyStatus = { online: boolean; estimate: string };
let cachedHour = -1;
let cachedStatus: ReplyStatus | null = null;

function getReplyStatusSnapshot(): ReplyStatus {
  const h = new Date().getHours();
  if (h !== cachedHour || !cachedStatus) {
    cachedHour = h;
    cachedStatus = { online: isAgentsOnline(), estimate: replyEstimate() };
  }
  return cachedStatus;
}

function noopSubscribe() {
  return () => {};
}

function getReplyStatusServerSnapshot(): ReplyStatus | null {
  return null;
}

export function useReplyStatus(): ReplyStatus | null {
  return useSyncExternalStore(noopSubscribe, getReplyStatusSnapshot, getReplyStatusServerSnapshot);
}
