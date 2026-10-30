"use client";

import { useSyncExternalStore } from "react";
import { Bell, BellRing } from "lucide-react";
import {
  addWatch,
  getWatchServerSnapshot,
  getWatchSnapshot,
  removeWatch,
  subscribeWatch,
  watchId,
  type WatchedRoute,
} from "@/lib/priceWatch";

type Props = Omit<WatchedRoute, "id" | "savedAt">;

/** Saves the route + today's lowest fare so the homepage can show whether it has moved. */
export default function WatchPriceButton(props: Props) {
  const list = useSyncExternalStore(subscribeWatch, getWatchSnapshot, getWatchServerSnapshot);
  const id = watchId(props);
  const watching = list.some((w) => w.id === id);

  return (
    <button
      type="button"
      aria-pressed={watching}
      onClick={() => (watching ? removeWatch(id) : addWatch(props))}
      className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-semibold transition ${
        watching
          ? "pop border-accent-500 bg-accent-100 text-accent-600"
          : "border-slate-200 text-brand-700 hover:border-brand-300 hover:bg-brand-50"
      }`}
    >
      {watching ? <BellRing size={14} className="bell-ring" /> : <Bell size={13} />}
      {watching ? "Watching price" : "Watch price"}
    </button>
  );
}
