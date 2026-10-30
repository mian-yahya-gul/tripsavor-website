import { airports, getAirport } from "@/data/airports";

/** Pakistani departure cities that get their own route landing pages. */
export const ORIGINS = ["KHI", "LHE", "ISB"] as const;

/** Popular international destinations from Pakistan. */
export const DESTINATIONS = ["DXB", "AUH", "DOH", "JED", "MED", "RUH", "MCT", "IST", "LHR", "KUL", "BKK", "YYZ"] as const;

export type RoutePair = { origin: string; destination: string; slug: string };

const slugCity = (code: string) => (getAirport(code)?.city ?? code).toLowerCase().replace(/[^a-z]+/g, "-");

export function routeSlug(origin: string, destination: string) {
  return `${slugCity(origin)}-to-${slugCity(destination)}`;
}

export function allRoutes(): RoutePair[] {
  const known = new Set(airports.map((a) => a.code));
  return ORIGINS.flatMap((o) =>
    DESTINATIONS.filter((d) => known.has(d) && known.has(o)).map((d) => ({
      origin: o,
      destination: d,
      slug: routeSlug(o, d),
    }))
  );
}

export function parseRoute(slug: string): RoutePair | undefined {
  return allRoutes().find((r) => r.slug === slug);
}
