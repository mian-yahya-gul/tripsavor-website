/**
 * Small reactive localStorage-backed store for `useSyncExternalStore`.
 * SSR-safe (server snapshot is the `empty` value), cross-tab via the `storage` event.
 */
export function createLocalStore<T>(
  key: string,
  empty: T,
  normalize: (v: unknown) => T = (v) => v as T
) {
  const listeners = new Set<() => void>();
  let cache: T = empty;
  let loaded = false;

  function load(): T {
    if (loaded || typeof window === "undefined") return cache;
    loaded = true;
    try {
      const raw = window.localStorage.getItem(key);
      cache = raw !== null ? normalize(JSON.parse(raw)) : empty;
    } catch {
      cache = empty;
    }
    return cache;
  }

  return {
    key,
    subscribe(cb: () => void) {
      listeners.add(cb);
      const onStorage = (e: StorageEvent) => {
        if (e.key === key) {
          loaded = false;
          load();
          cb();
        }
      };
      window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(cb);
        window.removeEventListener("storage", onStorage);
      };
    },
    getSnapshot: () => load(),
    getServerSnapshot: () => empty,
    get: () => load(),
    set(next: T) {
      cache = next;
      loaded = true;
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // ignore
      }
      listeners.forEach((l) => l());
    },
  };
}
