import type { Cabin, TripType } from "@/lib/fares/types";

export type RecentSearch = {
  from: string;
  to: string;
  depart: string;
  ret?: string;
  tripType: TripType;
  cabin: Cabin;
  adults: number;
  children: number;
  infants: number;
  ts: number;
};

const KEY = "tripsavor:recent-searches";
const MAX = 6;
const EMPTY: RecentSearch[] = [];

const listeners = new Set<() => void>();
let cache: RecentSearch[] = EMPTY;
let cacheRaw: string | null = null;
let dirty = true;

function keyOf(s: RecentSearch) {
  return [s.from, s.to, s.depart, s.ret ?? "", s.tripType, s.cabin, s.adults, s.children, s.infants].join(
    "|"
  );
}

function parse(raw: string | null): RecentSearch[] {
  if (!raw) return EMPTY;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;
    const clean = parsed
      .filter(
        (s): s is RecentSearch =>
          !!s && typeof s.from === "string" && typeof s.to === "string" && typeof s.ts === "number"
      )
      .sort((a, b) => b.ts - a.ts)
      .slice(0, MAX);
    return clean.length ? clean : EMPTY;
  } catch {
    return EMPTY;
  }
}

function readSnapshot(): RecentSearch[] {
  if (typeof window === "undefined") return EMPTY;
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    return EMPTY;
  }
  if (!dirty && raw === cacheRaw) return cache;
  dirty = false;
  cacheRaw = raw;
  cache = parse(raw);
  return cache;
}

function emit() {
  dirty = true;
  listeners.forEach((l) => l());
}

/** For `useSyncExternalStore`. */
export function subscribeRecentSearches(callback: () => void): () => void {
  listeners.add(callback);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY || e.key === null) {
      dirty = true;
      callback();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

export function getRecentSearchesSnapshot(): RecentSearch[] {
  return readSnapshot();
}

export function getRecentSearchesServerSnapshot(): RecentSearch[] {
  return EMPTY;
}

/** One-off read (non-reactive). */
export function getRecentSearches(): RecentSearch[] {
  dirty = true;
  return readSnapshot();
}

export function addRecentSearch(entry: Omit<RecentSearch, "ts">): void {
  const next: RecentSearch = { ...entry, ts: Date.now() };
  const existing = readSnapshot().filter((s) => keyOf(s) !== keyOf(next));
  const merged = [next, ...existing].slice(0, MAX);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(merged));
  } catch {
    // storage unavailable — carry on without persistence
  }
  emit();
}

export function clearRecentSearches(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
  emit();
}
