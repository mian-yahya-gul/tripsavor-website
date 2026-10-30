import { createLocalStore } from "@/lib/localStore";
import type { Cabin, TripType } from "@/lib/fares/types";

export type WatchedRoute = {
  id: string;
  from: string;
  to: string;
  depart: string;
  ret?: string;
  tripType: TripType;
  cabin: Cabin;
  /** lowest fare (PKR) when the route was saved */
  savedPrice: number;
  savedAt: number;
};

const store = createLocalStore<WatchedRoute[]>("tripsavor:price-watch", [], (v) =>
  Array.isArray(v) ? (v as WatchedRoute[]) : []
);

export const subscribeWatch = store.subscribe;
export const getWatchSnapshot = store.getSnapshot;
export const getWatchServerSnapshot = store.getServerSnapshot;

export function watchId(w: Pick<WatchedRoute, "from" | "to" | "depart" | "ret" | "tripType" | "cabin">) {
  return [w.from, w.to, w.depart, w.ret ?? "", w.tripType, w.cabin].join("|");
}

export function addWatch(w: Omit<WatchedRoute, "id" | "savedAt">) {
  const id = watchId(w);
  const rest = store.get().filter((x) => x.id !== id);
  store.set([{ ...w, id, savedAt: Date.now() }, ...rest].slice(0, 8));
}

export function removeWatch(id: string) {
  store.set(store.get().filter((x) => x.id !== id));
}
