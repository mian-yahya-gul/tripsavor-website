import { createLocalStore } from "@/lib/localStore";

const store = createLocalStore<string>("tripsavor:preferred-origin", "");

export const subscribePreferredOrigin = store.subscribe;
export const getPreferredOriginSnapshot = store.getSnapshot;
export const getPreferredOriginServerSnapshot = store.getServerSnapshot;
export function setPreferredOrigin(code: string) {
  if (code) store.set(code);
}
export function getPreferredOrigin() {
  return store.get();
}

const TZ_TO_AIRPORT: Record<string, string> = {
  "Asia/Karachi": "KHI",
  "Europe/London": "LHR",
  "Europe/Dublin": "DUB",
  "Europe/Paris": "CDG",
  "Europe/Berlin": "FRA",
  "Europe/Amsterdam": "AMS",
  "Europe/Madrid": "MAD",
  "Europe/Rome": "FCO",
  "Europe/Oslo": "OSL",
  "Europe/Stockholm": "ARN",
  "Europe/Copenhagen": "CPH",
  "Europe/Istanbul": "IST",
  "America/New_York": "JFK",
  "America/Toronto": "YYZ",
  "America/Chicago": "ORD",
  "America/Los_Angeles": "LAX",
  "America/Vancouver": "YVR",
  "America/Montreal": "YUL",
  "Asia/Dubai": "DXB",
  "Asia/Qatar": "DOH",
  "Asia/Riyadh": "JED",
  "Asia/Kuwait": "KWI",
  "Asia/Bahrain": "BAH",
  "Asia/Muscat": "MCT",
  "Asia/Kuala_Lumpur": "KUL",
  "Asia/Bangkok": "BKK",
  "Asia/Singapore": "SIN",
  "Australia/Sydney": "SYD",
  "Australia/Melbourne": "MEL",
};

/** Best-effort nearest hub from the browser's IANA timezone. "" when unknown. */
export function detectOriginFromTimeZone(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && TZ_TO_AIRPORT[tz]) return TZ_TO_AIRPORT[tz];
    if (tz && (tz.startsWith("Asia/") || tz === "PLT")) return "KHI";
  } catch {
    // ignore
  }
  return "";
}
