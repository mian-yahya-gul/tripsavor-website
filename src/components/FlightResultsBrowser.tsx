"use client";

import { useEffect, useMemo, useState } from "react";
import { Filter, Info, SlidersHorizontal, X } from "lucide-react";
import type { FlightOffer } from "@/lib/fares/types";
import { TIME_BUCKETS, minutesOf } from "@/lib/timeBuckets";
import FlightCard from "@/components/FlightCard";
import CompareTray from "@/components/CompareTray";
import DepartureTimeChart from "@/components/DepartureTimeChart";
import Price from "@/components/Price";

type Sort = "best" | "cheapest" | "fastest";

const SORTS: { id: Sort; label: string }[] = [
  { id: "best", label: "Best" },
  { id: "cheapest", label: "Cheapest" },
  { id: "fastest", label: "Fastest" },
];

function fmtDur(min: number) {
  return `${Math.floor(min / 60)}h ${String(min % 60).padStart(2, "0")}m`;
}
function toggle<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">{title}</h3>
      {children}
    </div>
  );
}

export default function FlightResultsBrowser({ offers }: { offers: FlightOffer[] }) {
  const bounds = useMemo(() => {
    const prices = offers.map((o) => o.price);
    const durations = offers.map((o) => o.durationMinutes);
    const airlineMap = new Map<string, { count: number; min: number }>();
    for (const o of offers) {
      const cur = airlineMap.get(o.airline) ?? { count: 0, min: Infinity };
      airlineMap.set(o.airline, { count: cur.count + 1, min: Math.min(cur.min, o.price) });
    }
    return {
      priceMin: prices.length ? Math.min(...prices) : 0,
      priceMax: prices.length ? Math.max(...prices) : 0,
      durMin: durations.length ? Math.min(...durations) : 0,
      durMax: durations.length ? Math.max(...durations) : 0,
      stops: [...new Set(offers.map((o) => o.stops))].sort((a, b) => a - b),
      airlines: [...airlineMap.entries()]
        .map(([name, v]) => ({ name, count: v.count, min: v.min }))
        .sort((a, b) => a.min - b.min),
    };
  }, [offers]);

  const [sort, setSort] = useState<Sort>("best");
  const [stops, setStops] = useState<Set<number>>(new Set());
  const [airlines, setAirlines] = useState<Set<string>>(new Set());
  const [buckets, setBuckets] = useState<Set<string>>(new Set());
  const [maxPrice, setMaxPrice] = useState(bounds.priceMax);
  const [maxDuration, setMaxDuration] = useState(bounds.durMax);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [compare, setCompare] = useState<FlightOffer[]>([]);

  const toggleCompare = (offer: FlightOffer) =>
    setCompare((cur) => {
      if (cur.some((o) => o.id === offer.id)) return cur.filter((o) => o.id !== offer.id);
      return cur.length >= 3 ? cur : [...cur, offer];
    });

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const hasPriceRange = bounds.priceMax > bounds.priceMin;
  const hasDurRange = bounds.durMax > bounds.durMin;

  const anyActive =
    stops.size > 0 ||
    airlines.size > 0 ||
    buckets.size > 0 ||
    maxPrice < bounds.priceMax ||
    maxDuration < bounds.durMax;

  const clearAll = () => {
    setStops(new Set());
    setAirlines(new Set());
    setBuckets(new Set());
    setMaxPrice(bounds.priceMax);
    setMaxDuration(bounds.durMax);
  };

  const visible = useMemo(() => {
    const filtered = offers.filter((o) => {
      if (stops.size && !stops.has(o.stops)) return false;
      if (airlines.size && !airlines.has(o.airline)) return false;
      if (o.price > maxPrice) return false;
      if (o.durationMinutes > maxDuration) return false;
      if (buckets.size) {
        const dm = minutesOf(o.departTime);
        const hit = TIME_BUCKETS.some((b) => buckets.has(b.id) && dm >= b.from && dm < b.to);
        if (!hit) return false;
      }
      return true;
    });

    const score = (o: FlightOffer) => {
      const p = (o.price - bounds.priceMin) / (bounds.priceMax - bounds.priceMin || 1);
      const d =
        (o.durationMinutes - bounds.durMin) / (bounds.durMax - bounds.durMin || 1);
      return p * 0.65 + d * 0.35;
    };

    return [...filtered].sort((a, b) => {
      if (sort === "cheapest") return a.price - b.price || a.durationMinutes - b.durationMinutes;
      if (sort === "fastest") return a.durationMinutes - b.durationMinutes || a.price - b.price;
      return score(a) - score(b);
    });
  }, [offers, stops, airlines, buckets, maxPrice, maxDuration, sort, bounds]);

  const cheapestId = visible.length
    ? visible.reduce((lo, o) => (o.price < lo.price ? o : lo)).id
    : null;
  const fastestId = visible.length
    ? visible.reduce((f, o) => (o.durationMinutes < f.durationMinutes ? o : f)).id
    : null;

  if (offers.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        No fares found for this route yet — WhatsApp us and we&apos;ll get you a live quote directly.
      </div>
    );
  }

  const filterPanel = (
    <div className="space-y-6">
      {bounds.stops.length > 1 && (
        <Section title="Stops">
          {bounds.stops.map((s) => (
            <label key={s} className="flex cursor-pointer items-center gap-2.5 py-1 text-sm">
              <input
                type="checkbox"
                checked={stops.has(s)}
                onChange={() => setStops((cur) => toggle(cur, s))}
                className="h-4 w-4 rounded border-slate-300 text-brand-600"
              />
              {s === 0 ? "Non-stop" : `${s} stop`}
            </label>
          ))}
        </Section>
      )}

      {hasPriceRange && (
        <Section title="Max price">
          <input
            type="range"
            min={bounds.priceMin}
            max={bounds.priceMax}
            step={500}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-brand-600"
          />
          <p className="mt-1 text-sm font-semibold text-brand-900">
            Up to <Price pkr={maxPrice} />
          </p>
        </Section>
      )}

      <Section title="Departure time">
        <div className="grid grid-cols-2 gap-2">
          {TIME_BUCKETS.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setBuckets((cur) => toggle(cur, b.id))}
              className={`rounded-lg border px-2 py-1.5 text-xs font-semibold transition ${
                buckets.has(b.id)
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-slate-200 text-slate-600 hover:border-brand-300"
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </Section>

      {hasDurRange && (
        <Section title="Max duration">
          <input
            type="range"
            min={bounds.durMin}
            max={bounds.durMax}
            step={15}
            value={maxDuration}
            onChange={(e) => setMaxDuration(Number(e.target.value))}
            className="w-full accent-brand-600"
          />
          <p className="mt-1 text-sm font-semibold text-brand-900">Up to {fmtDur(maxDuration)}</p>
        </Section>
      )}

      <Section title="Airlines">
        <div className="max-h-56 space-y-0.5 overflow-auto pr-1">
          {bounds.airlines.map((a) => (
            <label
              key={a.name}
              className="flex cursor-pointer items-center gap-2.5 py-1 text-sm"
            >
              <input
                type="checkbox"
                checked={airlines.has(a.name)}
                onChange={() => setAirlines((cur) => toggle(cur, a.name))}
                className="h-4 w-4 shrink-0 rounded border-slate-300 text-brand-600"
              />
              <span className="min-w-0 flex-1 truncate">{a.name}</span>
              <span className="shrink-0 text-xs text-slate-400">
                {a.count} · <Price pkr={a.min} short />
              </span>
            </label>
          ))}
        </div>
      </Section>

      {anyActive && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline"
        >
          <X size={14} />
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <>
    <div className="lg:grid lg:grid-cols-[15rem_1fr] lg:gap-8">
      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-5">
          <p className="mb-4 flex items-center gap-1.5 font-heading text-sm font-bold text-brand-950">
            <SlidersHorizontal size={15} />
            Filters
          </p>
          {filterPanel}
        </div>
      </aside>

      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            <strong className="font-heading text-brand-900">{visible.length}</strong> of{" "}
            {offers.length} flights
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-brand-700 lg:hidden"
            >
              <Filter size={13} />
              Filters
              {anyActive && <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />}
            </button>
            <div className="flex rounded-lg bg-brand-50 p-1 text-xs font-semibold">
              {SORTS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSort(s.id)}
                  className={`rounded-md px-3 py-1.5 transition ${
                    sort === s.id ? "bg-brand-600 text-white shadow-sm" : "text-slate-600 hover:text-brand-700"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DepartureTimeChart
          offers={offers}
          activeBuckets={buckets}
          onToggle={(id) => setBuckets((cur) => toggle(cur, id))}
        />

        <div className="mb-4 flex items-start gap-2 rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-800">
          <Info size={16} className="mt-0.5 shrink-0" />
          <span>
            Fares below are indicative estimates while we finish connecting live airline pricing —
            tap any flight to confirm the exact fare and lock in your seat on WhatsApp.
          </span>
        </div>

        {visible.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
            No flights match your filters.{" "}
            <button onClick={clearAll} className="font-semibold text-brand-700 hover:underline">
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {visible.map((offer) => (
              <FlightCard
                key={offer.id}
                offer={offer}
                tag={
                  offer.id === cheapestId
                    ? "Cheapest"
                    : offer.id === fastestId
                      ? "Fastest"
                      : undefined
                }
                selected={compare.some((o) => o.id === offer.id)}
                onToggleCompare={toggleCompare}
                compareDisabled={compare.length >= 3 && !compare.some((o) => o.id === offer.id)}
              />
            ))}
          </div>
        )}
      </div>

      {mobileOpen && (
        <div
          role="dialog"
          aria-label="Filters"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="absolute inset-y-0 left-0 flex w-80 max-w-[85vw] flex-col bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <p className="font-heading text-base font-bold text-brand-950">Filters</p>
              <button onClick={() => setMobileOpen(false)} aria-label="Close filters">
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">{filterPanel}</div>
            <div className="border-t border-slate-200 p-4">
              <button
                onClick={() => setMobileOpen(false)}
                className="w-full rounded-xl bg-brand-900 py-3 text-sm font-bold text-white"
              >
                Show {visible.length} flights
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

    <CompareTray
      offers={compare}
      onRemove={(id) => setCompare((cur) => cur.filter((o) => o.id !== id))}
      onClear={() => setCompare([])}
    />
    </>
  );
}
