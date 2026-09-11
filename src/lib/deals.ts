import { estimateDailyFare } from "@/lib/fareCalendar";
import { getAirport } from "@/data/airports";

const ORIGINS = ["KHI", "LHE", "ISB"];
const DESTS = [
  "DXB",
  "JED",
  "IST",
  "LHR",
  "DOH",
  "MED",
  "KUL",
  "BKK",
  "JFK",
  "MAN",
  "AUH",
  "YYZ",
];

const MIN_DROP_PCT = 8;

export type Deal = {
  origin: string;
  destination: string;
  originCity: string;
  destCity: string;
  price: number;
  typical: number;
  dropPct: number;
  date: string;
  returnDate: string;
  dateLabel: string;
};

function toIso(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}
function addDaysIso(iso: string, n: number) {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + n);
  return toIso(d);
}
function isoWeek(date: Date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/**
 * Deterministic "fare drop" feed: for each candidate route, compare the cheapest
 * estimate over the coming weeks against that route's typical level, and surface
 * the biggest gaps. The sampling window rotates by ISO week so the list refreshes.
 */
export function getDeals(now: Date = new Date(), limit = 6): Deal[] {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const startIso = toIso(start);
  const week = isoWeek(start);

  const deals: Deal[] = [];

  for (const origin of ORIGINS) {
    for (const destination of DESTS) {
      let typicalSum = 0;
      for (let k = 0; k < 10; k++) {
        typicalSum += estimateDailyFare({
          origin,
          destination,
          date: addDaysIso(startIso, 20 + k * 9),
          cabin: "Economy",
          tripType: "roundtrip",
        });
      }
      const typical = typicalSum / 10;

      let best = Infinity;
      let bestDate = "";
      for (let k = 0; k < 18; k++) {
        const off = 7 + ((week + k * 2) % 35);
        const date = addDaysIso(startIso, off);
        const price = estimateDailyFare({
          origin,
          destination,
          date,
          cabin: "Economy",
          tripType: "roundtrip",
        });
        if (price < best) {
          best = price;
          bestDate = date;
        }
      }

      const dropPct = Math.round(((typical - best) / typical) * 100);
      if (dropPct >= MIN_DROP_PCT) {
        deals.push({
          origin,
          destination,
          originCity: getAirport(origin)?.city ?? origin,
          destCity: getAirport(destination)?.city ?? destination,
          price: best,
          typical: Math.round(typical / 500) * 500,
          dropPct,
          date: bestDate,
          returnDate: addDaysIso(bestDate, 7),
          dateLabel: new Date(`${bestDate}T00:00:00`).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
          }),
        });
      }
    }
  }

  return deals.sort((a, b) => b.dropPct - a.dropPct).slice(0, limit);
}
