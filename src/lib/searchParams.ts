import type { Cabin, TripType } from "@/lib/fares/types";

export type MultiCityLeg = { from: string; to: string; depart: string };

export type SearchQuery = {
  from: string;
  to: string;
  depart: string;
  ret?: string;
  tripType: TripType;
  cabin: Cabin;
  adults: number;
  children: number;
  infants: number;
  /** Only used when tripType === "multicity". */
  legs?: MultiCityLeg[];
};

/** "KHI.DXB.2026-10-01~DXB.IST.2026-10-06" — codes are A–Z so "." is a safe field split. */
export function encodeLegs(legs: MultiCityLeg[]): string {
  return legs.map((l) => `${l.from}.${l.to}.${l.depart}`).join("~");
}

export function decodeLegs(raw: string | undefined | null): MultiCityLeg[] {
  if (!raw) return [];
  return raw
    .split("~")
    .map((chunk) => {
      const [from, to, depart] = chunk.split(".");
      return { from: (from ?? "").toUpperCase(), to: (to ?? "").toUpperCase(), depart: depart ?? "" };
    })
    .filter((l) => l.from && l.to && l.depart && l.from !== l.to);
}

/** Canonical query string for the /search route. */
export function buildSearchQuery(s: SearchQuery): string {
  const params = new URLSearchParams({
    from: s.from,
    to: s.to,
    depart: s.depart,
    tripType: s.tripType,
    cabin: s.cabin,
    adults: String(s.adults),
    children: String(s.children),
    infants: String(s.infants),
  });
  if (s.tripType === "roundtrip" && s.ret) params.set("return", s.ret);
  if (s.tripType === "multicity" && s.legs && s.legs.length > 0) {
    params.set("legs", encodeLegs(s.legs));
  }
  return params.toString();
}
