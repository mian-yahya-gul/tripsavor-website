import { getBaseFare } from "@/data/baseFares";
import type { Cabin, TripType } from "@/lib/fares/types";

const CABIN_MULTIPLIER: Record<Cabin, number> = { Economy: 1, Business: 3.4 };

/** FNV-1a → 0..1, deterministic per string. */
function hash01(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967296;
}

/**
 * Deterministic estimated *lowest* fare (PKR) for a route on a given day.
 * Mirrors the shape of the dummy fare provider (zone base × cabin × trip)
 * but stays synchronous so a whole month grid can be priced in one render.
 */
export function estimateDailyFare(opts: {
  origin: string;
  destination: string;
  date: string; // yyyy-mm-dd
  cabin: Cabin;
  tripType: TripType;
}): number {
  const { origin, destination, date, cabin, tripType } = opts;
  if (!origin || !destination || origin === destination) return 0;

  const base = getBaseFare(origin, destination) * (CABIN_MULTIPLIER[cabin] ?? 1);
  const trip = tripType === "roundtrip" ? 1.85 : 1;

  const d = new Date(`${date}T00:00:00`);
  if (Number.isNaN(d.getTime())) return 0;

  // Fri/Sat/Sun travel costs more; Tue/Wed are the cheapest days.
  const dowFactor = [1.06, 0.94, 0.9, 0.92, 1.0, 1.12, 1.13][d.getDay()];
  // Rough seasonality — summer + December peaks.
  const seasonFactor = [
    0.95, 0.93, 0.97, 1.0, 1.03, 1.12, 1.18, 1.15, 1.0, 0.96, 0.94, 1.1,
  ][d.getMonth()];
  const noise = 0.9 + hash01(`${origin}-${destination}-${date}-${cabin}`) * 0.28;

  const raw = base * trip * dowFactor * seasonFactor * noise;
  return Math.max(1000, Math.round(raw / 500) * 500);
}

/** 42500 → "43k", 145000 → "145k". */
export function formatFareShort(pkr: number): string {
  if (pkr <= 0) return "";
  if (pkr >= 1000) return `${Math.round(pkr / 1000)}k`;
  return String(pkr);
}
