export type CurrencyCode = "PKR" | "USD" | "GBP" | "AED" | "SAR";

export type CurrencyMeta = {
  code: CurrencyCode;
  label: string;
  /** how many PKR one unit of this currency is worth (indicative) */
  pkrPer: number;
};

export const CURRENCIES: Record<CurrencyCode, CurrencyMeta> = {
  PKR: { code: "PKR", label: "PKR", pkrPer: 1 },
  USD: { code: "USD", label: "USD $", pkrPer: 278 },
  GBP: { code: "GBP", label: "GBP £", pkrPer: 352 },
  AED: { code: "AED", label: "AED", pkrPer: 75.7 },
  SAR: { code: "SAR", label: "SAR", pkrPer: 74.1 },
};

export const CURRENCY_CODES = Object.keys(CURRENCIES) as CurrencyCode[];

function convert(pkr: number, code: CurrencyCode) {
  return code === "PKR" ? Math.round(pkr) : Math.round(pkr / CURRENCIES[code].pkrPer);
}

/** Full form, e.g. "PKR 42,500" · "$ 153" · "AED 561". */
export function formatMoney(pkr: number, code: CurrencyCode): string {
  const value = convert(pkr, code).toLocaleString();
  if (code === "USD") return `$ ${value}`;
  if (code === "GBP") return `£ ${value}`;
  return `${code} ${value}`;
}

/** Compact form for dense chart / calendar labels: "42k" in PKR, whole units otherwise. */
export function formatMoneyShort(pkr: number, code: CurrencyCode): string {
  if (code === "PKR") {
    return pkr >= 1000 ? `${Math.round(pkr / 1000)}k` : `${Math.round(pkr)}`;
  }
  const value = convert(pkr, code).toLocaleString();
  if (code === "USD") return `$${value}`;
  if (code === "GBP") return `£${value}`;
  return `${code} ${value}`;
}

// ---- reactive store (useSyncExternalStore) ----

const KEY = "tripsavor:currency";
const listeners = new Set<() => void>();
let current: CurrencyCode = "PKR";
let loaded = false;

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const v = window.localStorage.getItem(KEY);
    if (v && v in CURRENCIES) current = v as CurrencyCode;
  } catch {
    // ignore
  }
}

export function subscribeCurrency(callback: () => void): () => void {
  listeners.add(callback);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      loaded = false;
      ensureLoaded();
      callback();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

export function getCurrencySnapshot(): CurrencyCode {
  ensureLoaded();
  return current;
}

export function getCurrencyServerSnapshot(): CurrencyCode {
  return "PKR";
}

export function setCurrency(code: CurrencyCode) {
  current = code;
  loaded = true;
  try {
    window.localStorage.setItem(KEY, code);
  } catch {
    // ignore
  }
  listeners.forEach((l) => l());
}
