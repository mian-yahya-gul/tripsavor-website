import { Info } from "lucide-react";
import type { FlightOffer } from "@/lib/fares/types";
import FlightCard from "@/components/FlightCard";

export default function FlightResults({ offers }: { offers: FlightOffer[] }) {
  if (offers.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        No fares found for this route yet — WhatsApp us and we&apos;ll get you a live quote directly.
      </div>
    );
  }

  const cheapestId = offers[0].id;
  const fastestId = [...offers].sort((a, b) => a.durationMinutes - b.durationMinutes)[0].id;

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-800">
        <Info size={16} className="mt-0.5 shrink-0" />
        <span>
          Fares below are indicative estimates while we finish connecting live airline pricing —
          tap any flight to confirm the exact fare and lock in your seat on WhatsApp.
        </span>
      </div>

      {offers.map((offer) => (
        <FlightCard
          key={offer.id}
          offer={offer}
          tag={offer.id === cheapestId ? "Cheapest" : offer.id === fastestId ? "Fastest" : undefined}
        />
      ))}
    </div>
  );
}
