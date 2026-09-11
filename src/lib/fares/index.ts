import { dummyFareProvider } from "./dummyProvider";
import type { FareProvider } from "./types";

/**
 * Single switch point for fare data. Everything else in the app only ever
 * imports `getFareProvider` — never dummyProvider directly — so wiring up a
 * real source later (Amadeus, a GDS, or the agent's own fare sheet API) is a
 * one-line change here instead of a search-and-replace across the codebase.
 *
 * When a real API is ready:
 *   const provider = process.env.FARE_PROVIDER ?? "dummy";
 *   if (provider === "amadeus") return amadeusFareProvider;
 * as long as the new provider implements FareProvider, nothing downstream changes.
 */
export function getFareProvider(): FareProvider {
  return dummyFareProvider;
}

export * from "./types";
