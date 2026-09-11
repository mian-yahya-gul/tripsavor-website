export type Cabin = "Economy" | "Business";
export type TripType = "oneway" | "roundtrip" | "multicity";

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departDate: string;
  returnDate?: string;
  tripType: TripType;
  cabin: Cabin;
  adults: number;
  children: number;
  infants: number;
}

export interface FlightOffer {
  id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departTime: string;
  arriveTime: string;
  arrivesNextDay: boolean;
  durationMinutes: number;
  stops: number;
  cabin: Cabin;
  price: number;
  currency: string;
  /** true while this offer comes from mock data rather than a live fare API */
  isEstimate: boolean;

  // Enriched detail (mock today; a real provider would return these too)
  aircraft: string;
  /** Checked baggage allowance, kg. */
  baggageKg: number;
  /** Cabin baggage allowance, kg. */
  handBaggageKg: number;
  /** Present when stops === 1. */
  layoverAirport?: string;
  layoverMinutes?: number;
  /** Estimated CO₂ per traveler for the journey, kg. */
  co2Kg: number;
}

/**
 * Contract every fare source implements — dummy data today, a real GDS/aggregator
 * API later. Nothing outside src/lib/fares should care which one is active.
 */
export interface FareProvider {
  name: string;
  searchFlights(params: FlightSearchParams): Promise<FlightOffer[]>;
}
