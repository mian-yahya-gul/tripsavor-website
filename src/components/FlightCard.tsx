"use client";

import { useState } from "react";
import { ArrowRight, ChevronDown, Leaf, Luggage, Plane, PlaneTakeoff, Scale } from "lucide-react";
import type { FlightOffer } from "@/lib/fares/types";
import { cityForCode } from "@/data/airports";
import { siteConfig } from "@/data/site";
import Price from "@/components/Price";

type FamilyId = "saver" | "standard" | "flex";

const FARE_FAMILIES: { id: FamilyId; label: string; mult: number; perks: string[] }[] = [
  { id: "saver", label: "Saver", mult: 1, perks: ["Cabin bag only", "No changes", "Seat for a fee"] },
  {
    id: "standard",
    label: "Standard",
    mult: 1.12,
    perks: ["1 checked bag", "Change for a fee", "Standard seat included"],
  },
  {
    id: "flex",
    label: "Flex",
    mult: 1.28,
    perks: ["2 checked bags", "Free date changes", "Seat selection included"],
  },
];

function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${String(m).padStart(2, "0")}m`;
}

type Props = {
  offer: FlightOffer;
  tag?: string;
  selected?: boolean;
  onToggleCompare?: (offer: FlightOffer) => void;
  compareDisabled?: boolean;
};

export default function FlightCard({
  offer,
  tag,
  selected = false,
  onToggleCompare,
  compareDisabled = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [familyId, setFamilyId] = useState<FamilyId>("saver");

  const family = FARE_FAMILIES.find((f) => f.id === familyId)!;
  const price = Math.round((offer.price * family.mult) / 500) * 500;

  const waMessage = encodeURIComponent(
    `Hi! I'd like to book ${offer.origin} → ${offer.destination}, ${offer.cabin} (${family.label}), ` +
      `flight ${offer.flightNumber} at ~PKR ${price.toLocaleString()}. Please confirm the live fare.`
  );
  const waLink = `https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, "")}?text=${waMessage}`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-brand-200 hover:shadow-md">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <PlaneTakeoff size={20} />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-heading text-sm font-bold text-brand-950">{offer.airline}</p>
              <span className="text-xs text-slate-400">{offer.flightNumber}</span>
              {tag && (
                <span className="rounded-full bg-accent-100 px-2 py-0.5 text-[11px] font-semibold text-accent-600">
                  {tag}
                </span>
              )}
            </div>
            <div className="mt-1.5 flex items-center gap-2 text-sm text-slate-600">
              <span className="font-semibold text-brand-900">{offer.departTime}</span>
              <span className="text-slate-300">{offer.origin}</span>
              <ArrowRight size={14} className="text-slate-300" />
              <span className="font-semibold text-brand-900">
                {offer.arriveTime}
                {offer.arrivesNextDay && <sup className="ml-0.5 text-accent-600">+1</sup>}
              </span>
              <span className="text-slate-300">{offer.destination}</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              {formatDuration(offer.durationMinutes)} ·{" "}
              {offer.stops === 0
                ? "Non-stop"
                : `1 stop${offer.layoverAirport ? ` · ${offer.layoverAirport}` : ""}`}{" "}
              · {offer.cabin}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center">
          <div className="text-right">
            <p className="font-heading text-xl font-extrabold text-brand-950">
              <Price pkr={price} />
            </p>
            <p className="text-[11px] text-slate-400">
              {family.label}
              {offer.isEstimate ? " · estimated" : ""}
            </p>
          </div>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap rounded-lg bg-accent-500 px-5 py-2.5 text-sm font-bold text-brand-950 shadow-sm shadow-accent-500/30 transition hover:bg-accent-400"
          >
            Confirm on WhatsApp
          </a>
        </div>
      </div>

      <div className="flex items-center border-t border-slate-100">
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex flex-1 items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-brand-700 transition hover:bg-brand-50"
        >
          <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
          {open ? "Hide details" : "Flight details & fare options"}
        </button>
        {onToggleCompare && (
          <button
            onClick={() => onToggleCompare(offer)}
            disabled={compareDisabled}
            aria-pressed={selected}
            className={`flex items-center gap-1.5 border-l border-slate-100 px-4 py-2.5 text-xs font-semibold transition ${
              selected
                ? "bg-brand-600 text-white"
                : compareDisabled
                  ? "cursor-not-allowed text-slate-300"
                  : "text-brand-700 hover:bg-brand-50"
            }`}
          >
            <Scale size={13} />
            {selected ? "Comparing" : "Compare"}
          </button>
        )}
      </div>

      {open && (
        <div className="space-y-5 border-t border-slate-100 bg-slate-50/60 p-5">
          {/* Itinerary timeline */}
          <div>
            <ol className="relative ml-1 border-l-2 border-dashed border-slate-300">
              <li className="mb-4 ml-4">
                <span className="absolute -left-[7px] mt-1 h-3 w-3 rounded-full bg-brand-600" />
                <p className="text-sm font-bold text-brand-950">
                  {offer.departTime} · {cityForCode(offer.origin)} ({offer.origin})
                </p>
                <p className="text-xs text-slate-500">Departure</p>
              </li>
              {offer.stops === 1 && offer.layoverAirport && (
                <li className="mb-4 ml-4">
                  <span className="absolute -left-[7px] mt-1 h-3 w-3 rounded-full border-2 border-accent-500 bg-white" />
                  <p className="text-sm font-semibold text-slate-700">
                    Layover · {cityForCode(offer.layoverAirport)} ({offer.layoverAirport})
                  </p>
                  <p className="text-xs text-slate-500">
                    {offer.layoverMinutes ? formatDuration(offer.layoverMinutes) : "Short"} · change
                    planes
                  </p>
                </li>
              )}
              <li className="ml-4">
                <span className="absolute -left-[7px] mt-1 h-3 w-3 rounded-full bg-brand-950" />
                <p className="text-sm font-bold text-brand-950">
                  {offer.arriveTime}
                  {offer.arrivesNextDay ? " (+1 day)" : ""} · {cityForCode(offer.destination)} (
                  {offer.destination})
                </p>
                <p className="text-xs text-slate-500">
                  Arrival · total {formatDuration(offer.durationMinutes)}
                </p>
              </li>
            </ol>
          </div>

          {/* Detail grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Detail icon={<Plane size={14} />} label="Aircraft" value={offer.aircraft} />
            <Detail
              icon={<Luggage size={14} />}
              label="Checked bag"
              value={`${offer.baggageKg} kg`}
            />
            <Detail
              icon={<Luggage size={14} />}
              label="Cabin bag"
              value={`${offer.handBaggageKg} kg`}
            />
            <Detail
              icon={<Leaf size={14} />}
              label="Est. CO₂ / traveler"
              value={`${offer.co2Kg} kg`}
            />
          </div>

          {/* Fare families */}
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
              Fare options
            </p>
            <div className="grid gap-2 sm:grid-cols-3">
              {FARE_FAMILIES.map((f) => {
                const fPrice = Math.round((offer.price * f.mult) / 500) * 500;
                const active = f.id === familyId;
                return (
                  <button
                    key={f.id}
                    onClick={() => setFamilyId(f.id)}
                    aria-pressed={active}
                    className={`rounded-xl border p-3 text-left transition ${
                      active
                        ? "border-brand-600 bg-white ring-1 ring-brand-600"
                        : "border-slate-200 bg-white hover:border-brand-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-heading text-sm font-bold text-brand-950">{f.label}</span>
                      <span className="text-sm font-bold text-brand-900">
                        <Price pkr={fPrice} />
                      </span>
                    </div>
                    <ul className="mt-1.5 space-y-0.5 text-[11px] text-slate-500">
                      {f.perks.map((p) => (
                        <li key={p}>• {p}</li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            Baggage, aircraft, layover and emissions figures are indicative estimates — our team
            confirms the exact fare rules on WhatsApp before you pay.
          </p>
        </div>
      )}
    </div>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {icon}
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-brand-950">{value}</p>
    </div>
  );
}
