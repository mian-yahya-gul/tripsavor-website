/**
 * DUMMY FARE DATA — placeholder until a real fare source (Amadeus, a GDS, or the
 * manually-maintained agent fare sheet) is wired up via src/lib/fares.
 *
 * Explicit overrides for well-known routes; everything else falls back to a
 * zone-based estimate so any origin/destination pair from the search widget
 * still returns something reasonable instead of erroring out.
 */

export type Zone = "domestic" | "gcc" | "international";

export const airportZones: Record<string, Zone> = {
  // Pakistan
  KHI: "domestic",
  LHE: "domestic",
  ISB: "domestic",
  PEW: "domestic",
  MUX: "domestic",
  UET: "domestic",
  SKT: "domestic",
  LYP: "domestic",
  KDU: "domestic",
  GWD: "domestic",
  SKZ: "domestic",
  // GCC
  DXB: "gcc",
  AUH: "gcc",
  SHJ: "gcc",
  DOH: "gcc",
  JED: "gcc",
  MED: "gcc",
  RUH: "gcc",
  DMM: "gcc",
  KWI: "gcc",
  BAH: "gcc",
  MCT: "gcc",
  SLL: "gcc",
  // Everything else falls through to the "international" default in getBaseFare()
  IST: "international",
  LHR: "international",
  BKK: "international",
};

/** One-way, economy, PKR — explicit known routes take priority over the zone fallback. */
export const knownRouteFares: Record<string, number> = {
  "KHI-DXB": 45000,
  "DXB-KHI": 45000,
  "LHE-DXB": 42000,
  "DXB-LHE": 42000,
  "ISB-DXB": 44000,
  "DXB-ISB": 44000,
  "KHI-LHE": 18000,
  "LHE-KHI": 18000,
  "ISB-KHI": 19000,
  "KHI-ISB": 19000,
  "ISB-LHE": 16000,
  "LHE-ISB": 16000,
};

const zonePairBaseFare: Record<string, number> = {
  "domestic-domestic": 19000,
  "domestic-gcc": 46000,
  "domestic-international": 115000,
  "gcc-gcc": 38000,
  "gcc-international": 95000,
  "international-international": 130000,
};

export function getBaseFare(origin: string, destination: string): number {
  const direct = knownRouteFares[`${origin}-${destination}`];
  if (direct) return direct;

  const originZone = airportZones[origin] ?? "international";
  const destZone = airportZones[destination] ?? "international";
  const key = [originZone, destZone].sort().join("-");
  return zonePairBaseFare[key] ?? zonePairBaseFare["domestic-international"];
}
