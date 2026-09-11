import { airlinesWeCompare } from "@/data/site";
import { airportZones, getBaseFare } from "@/data/baseFares";
import type { FareProvider, FlightOffer, FlightSearchParams } from "./types";

/**
 * Deterministic pseudo-random generator so the same search returns the same
 * mock results on every render instead of reshuffling — makes it behave like
 * a real cached fare lookup rather than obviously-random placeholder data.
 */
function seededRandom(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return function next() {
    h = (Math.imul(h ^ (h >>> 15), 1 | h) + 0x6d2b79f5) | 0;
    let t = Math.imul(h ^ (h >>> 7), 61 | h);
    t = (t + Math.imul(t ^ (t >>> 14), t | 61)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function formatTime(totalMinutes: number): { time: string; nextDay: boolean } {
  const nextDay = totalMinutes >= 24 * 60;
  const m = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const hh = String(Math.floor(m / 60)).padStart(2, "0");
  const mm = String(m % 60).padStart(2, "0");
  return { time: `${hh}:${mm}`, nextDay };
}

function tierFor(origin: string, destination: string) {
  const oz = airportZones[origin] ?? "international";
  const dz = airportZones[destination] ?? "international";
  if (oz === "domestic" && dz === "domestic") return "domestic" as const;
  if (oz === "international" || dz === "international") return "international" as const;
  return "gcc" as const;
}

const DURATION_RANGE_MIN: Record<ReturnType<typeof tierFor>, [number, number]> = {
  domestic: [70, 130],
  gcc: [150, 260],
  international: [360, 660],
};

const CABIN_MULTIPLIER = { Economy: 1, Business: 3.4 };
const OFFER_COUNT = 5;

const AIRCRAFT = [
  "Boeing 777-300ER",
  "Airbus A350-900",
  "Boeing 787-9 Dreamliner",
  "Airbus A321neo",
  "Boeing 737-800",
  "Airbus A320neo",
];
const HUB_AIRPORTS = ["DXB", "DOH", "AUH", "IST", "JED", "MCT", "BAH", "KWI"];

export const dummyFareProvider: FareProvider = {
  name: "dummy",

  async searchFlights(params: FlightSearchParams): Promise<FlightOffer[]> {
    // Simulated fare-lookup latency so streaming / loading UI is exercised.
    // A real provider replaces this with its own network round-trip.
    await new Promise((resolve) => setTimeout(resolve, 700));

    const { origin, destination, departDate, tripType, cabin } = params;
    const rand = seededRandom(`${origin}-${destination}-${departDate}-${cabin}`);
    const tier = tierFor(origin, destination);
    const [minDur, maxDur] = DURATION_RANGE_MIN[tier];
    const baseFare = getBaseFare(origin, destination) * CABIN_MULTIPLIER[cabin];
    const tripMultiplier = tripType === "roundtrip" ? 1.85 : 1;

    const airlines = [...airlinesWeCompare].sort(() => rand() - 0.5).slice(0, OFFER_COUNT);

    const offers: FlightOffer[] = airlines.map((airline, i) => {
      const durationMinutes = Math.round(minDur + rand() * (maxDur - minDur));
      const stops = tier === "domestic" ? 0 : rand() > 0.65 ? 1 : 0;
      const departMinutes = Math.round(rand() * 24 * 60);
      const { time: departTime } = formatTime(departMinutes);
      const { time: arriveTime, nextDay } = formatTime(
        departMinutes + durationMinutes + stops * 60
      );

      const priceVariance = 0.9 + rand() * 0.35;
      const price = Math.round(
        (baseFare * priceVariance * tripMultiplier) / 500
      ) * 500;

      const totalDuration = durationMinutes + stops * 60;
      const layoverMinutes = stops === 1 ? 60 + Math.round(rand() * 180) : undefined;
      const layoverAirport =
        stops === 1
          ? (HUB_AIRPORTS.filter((c) => c !== origin && c !== destination)[
              Math.floor(rand() * (HUB_AIRPORTS.length - 1))
            ] ?? "DXB")
          : undefined;

      // Rough per-traveler emissions: cruise ~800 km/h, ~0.09 kg CO₂/pax·km economy.
      const flightMinutes = totalDuration - (layoverMinutes ?? 0);
      const km = (flightMinutes / 60) * 800;
      const co2Kg =
        Math.round((km * 0.09 * (cabin === "Business" ? 2.9 : 1) * (0.92 + rand() * 0.2)) / 5) * 5;

      return {
        id: `dummy-${origin}-${destination}-${departDate}-${i}`,
        airline,
        flightNumber: `${airline.slice(0, 2).toUpperCase()}${100 + Math.round(rand() * 800)}`,
        origin,
        destination,
        departTime,
        arriveTime,
        arrivesNextDay: nextDay,
        durationMinutes: totalDuration,
        stops,
        cabin,
        price,
        currency: "PKR",
        isEstimate: true,
        aircraft: AIRCRAFT[Math.floor(rand() * AIRCRAFT.length)] ?? AIRCRAFT[0],
        baggageKg: cabin === "Business" ? 40 : [25, 30, 30, 35][Math.floor(rand() * 4)] ?? 30,
        handBaggageKg: cabin === "Business" ? 10 : 7,
        layoverAirport,
        layoverMinutes,
        co2Kg,
      };
    });

    return offers.sort((a, b) => a.price - b.price);
  },
};
