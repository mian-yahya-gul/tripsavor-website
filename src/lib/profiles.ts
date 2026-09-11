export type ContactProfile = { name: string; email: string; phone: string };

export type Traveller = {
  id: string;
  fullName: string;
  dob: string;
  nationality: string;
  passport: string;
  passportExpiry: string;
};

function makeStore<T>(key: string, empty: T, normalize: (v: unknown) => T) {
  const listeners = new Set<() => void>();
  let cache: T = empty;
  let loaded = false;

  function load(): T {
    if (loaded || typeof window === "undefined") return cache;
    loaded = true;
    try {
      const raw = window.localStorage.getItem(key);
      cache = raw ? normalize(JSON.parse(raw)) : empty;
    } catch {
      cache = empty;
    }
    return cache;
  }

  return {
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
    snapshot: () => load(),
    serverSnapshot: () => empty,
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

// ---- contact ----

const EMPTY_CONTACT: ContactProfile = { name: "", email: "", phone: "" };

const contact = makeStore<ContactProfile>("tripsavor:contact", EMPTY_CONTACT, (v) => {
  const o = (v ?? {}) as Partial<ContactProfile>;
  return {
    name: String(o.name ?? ""),
    email: String(o.email ?? ""),
    phone: String(o.phone ?? ""),
  };
});

export const subscribeContact = contact.subscribe;
export const getContactSnapshot = contact.snapshot;
export const getContactServerSnapshot = contact.serverSnapshot;
export function saveContact(p: ContactProfile) {
  contact.set(p);
}
export function clearContact() {
  contact.set(EMPTY_CONTACT);
}
export function hasContact(p: ContactProfile) {
  return Boolean(p.name || p.email || p.phone);
}

// ---- travellers ----

const EMPTY_TRAVELLERS: Traveller[] = [];

const travellers = makeStore<Traveller[]>("tripsavor:travellers", EMPTY_TRAVELLERS, (v) =>
  Array.isArray(v)
    ? v
        .filter((t) => t && typeof t.fullName === "string")
        .map((t) => ({
          id: String(t.id ?? `t-${Math.random().toString(36).slice(2)}`),
          fullName: String(t.fullName ?? ""),
          dob: String(t.dob ?? ""),
          nationality: String(t.nationality ?? ""),
          passport: String(t.passport ?? ""),
          passportExpiry: String(t.passportExpiry ?? ""),
        }))
    : []
);

export const subscribeTravellers = travellers.subscribe;
export const getTravellersSnapshot = travellers.snapshot;
export const getTravellersServerSnapshot = travellers.serverSnapshot;

function newId() {
  return `t-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
export function addTraveller(t: Omit<Traveller, "id">) {
  travellers.set([...travellers.get(), { ...t, id: newId() }]);
}
export function updateTraveller(id: string, patch: Partial<Traveller>) {
  travellers.set(travellers.get().map((t) => (t.id === id ? { ...t, ...patch } : t)));
}
export function removeTraveller(id: string) {
  travellers.set(travellers.get().filter((t) => t.id !== id));
}
