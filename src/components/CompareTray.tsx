"use client";

import { useEffect, useState } from "react";
import { Scale, X } from "lucide-react";
import type { FlightOffer } from "@/lib/fares/types";
import { siteConfig } from "@/data/site";
import Price from "@/components/Price";

function fmtDur(min: number) {
  return `${Math.floor(min / 60)}h ${String(min % 60).padStart(2, "0")}m`;
}

function waLink(o: FlightOffer) {
  const msg = encodeURIComponent(
    `Hi! I'd like to book ${o.origin} → ${o.destination}, ${o.cabin}, flight ${o.flightNumber} ` +
      `at ~PKR ${o.price.toLocaleString()}. Please confirm the live fare.`
  );
  return `https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, "")}?text=${msg}`;
}

function Row({ label, cells }: { label: string; cells: React.ReactNode[] }) {
  return (
    <tr>
      <td className="py-2.5 pr-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </td>
      {cells.map((c, i) => (
        <td key={i} className="px-3 py-2.5 text-slate-700">
          {c}
        </td>
      ))}
    </tr>
  );
}

export default function CompareTray({
  offers,
  onRemove,
  onClear,
}: {
  offers: FlightOffer[];
  onRemove: (id: string) => void;
  onClear: () => void;
}) {
  const [modal, setModal] = useState(false);

  useEffect(() => {
    if (!modal) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setModal(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [modal]);

  if (offers.length === 0) return null;

  const showModal = modal && offers.length >= 2;

  const minPrice = Math.min(...offers.map((o) => o.price));
  const minDur = Math.min(...offers.map((o) => o.durationMinutes));
  const minStops = Math.min(...offers.map((o) => o.stops));
  const minCo2 = Math.min(...offers.map((o) => o.co2Kg));
  const multi = offers.length > 1;
  const best = (isBest: boolean) => (multi && isBest ? "font-bold text-emerald-700" : "");

  return (
    <>
      <div className="h-20" aria-hidden />

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white shadow-[0_-4px_24px_rgba(8,35,78,0.12)]">
        <div className="mx-auto flex max-w-6xl items-center gap-3 py-3 pl-4 pr-20 sm:pl-6 sm:pr-24 lg:pl-8">
          <span className="hidden shrink-0 items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-400 sm:flex">
            <Scale size={14} />
            Compare
          </span>
          <div className="flex flex-1 gap-2 overflow-x-auto">
            {offers.map((o) => (
              <span
                key={o.id}
                className="flex shrink-0 items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs"
              >
                <span className="font-heading font-bold text-brand-900">{o.airline}</span>
                <span className="text-slate-400">
                  <Price pkr={o.price} />
                </span>
                <button
                  onClick={() => onRemove(o.id)}
                  aria-label={`Remove ${o.airline} from compare`}
                  className="text-slate-400 transition hover:text-red-600"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
            {Array.from({ length: 3 - offers.length }).map((_, i) => (
              <span
                key={i}
                className="hidden shrink-0 items-center rounded-full border border-dashed border-slate-200 px-3 py-1.5 text-xs text-slate-300 sm:flex"
              >
                Pin a flight
              </span>
            ))}
          </div>
          <button
            onClick={onClear}
            className="shrink-0 text-xs font-semibold text-slate-400 transition hover:text-red-600"
          >
            Clear
          </button>
          <button
            onClick={() => setModal(true)}
            disabled={offers.length < 2}
            className="shrink-0 rounded-lg bg-brand-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-brand-800 disabled:opacity-40"
          >
            Compare {offers.length}
          </button>
        </div>
      </div>

      {showModal && (
        <div
          role="dialog"
          aria-label="Compare flights"
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-6"
          onClick={() => setModal(false)}
        >
          <div
            className="max-h-[85vh] w-full max-w-3xl overflow-auto rounded-t-2xl bg-white sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
              <p className="font-heading text-base font-bold text-brand-950">
                Compare {offers.length} flights
              </p>
              <button onClick={() => setModal(false)} aria-label="Close comparison">
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            <div className="overflow-x-auto p-5">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead>
                  <tr>
                    <th className="w-24" />
                    {offers.map((o) => (
                      <th key={o.id} className="px-3 pb-3 align-bottom">
                        <span className="font-heading text-sm font-bold text-brand-950">
                          {o.airline}
                        </span>
                        <span className="block text-xs font-normal text-slate-400">
                          {o.flightNumber}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <Row
                    label="Price"
                    cells={offers.map((o) => (
                      <span key={o.id} className={best(o.price === minPrice)}>
                        <Price pkr={o.price} />
                      </span>
                    ))}
                  />
                  <Row label="Depart" cells={offers.map((o) => `${o.departTime} · ${o.origin}`)} />
                  <Row
                    label="Arrive"
                    cells={offers.map(
                      (o) => `${o.arriveTime}${o.arrivesNextDay ? " +1" : ""} · ${o.destination}`
                    )}
                  />
                  <Row
                    label="Duration"
                    cells={offers.map((o) => (
                      <span key={o.id} className={best(o.durationMinutes === minDur)}>
                        {fmtDur(o.durationMinutes)}
                      </span>
                    ))}
                  />
                  <Row
                    label="Stops"
                    cells={offers.map((o) => (
                      <span key={o.id} className={best(o.stops === minStops)}>
                        {o.stops === 0 ? "Non-stop" : `1 stop · ${o.layoverAirport ?? ""}`}
                      </span>
                    ))}
                  />
                  <Row label="Aircraft" cells={offers.map((o) => o.aircraft)} />
                  <Row label="Checked bag" cells={offers.map((o) => `${o.baggageKg} kg`)} />
                  <Row
                    label="Est. CO₂"
                    cells={offers.map((o) => (
                      <span key={o.id} className={best(o.co2Kg === minCo2)}>
                        {o.co2Kg} kg
                      </span>
                    ))}
                  />
                  <tr>
                    <td />
                    {offers.map((o) => (
                      <td key={o.id} className="px-3 pt-3">
                        <a
                          href={waLink(o)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block rounded-lg bg-accent-500 px-3 py-1.5 text-xs font-bold text-brand-950 transition hover:bg-accent-400"
                        >
                          Book
                        </a>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
              <p className="mt-4 text-[11px] text-slate-400">
                Prices shown are the Saver fare estimate. Our team confirms exact fare rules on
                WhatsApp before you pay.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
