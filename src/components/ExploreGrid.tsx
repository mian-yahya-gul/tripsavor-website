"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import AirportField from "@/components/AirportField";
import Price, { useCurrency } from "@/components/Price";
import { airports, cityForCode, type AirportRegion } from "@/data/airports";
import { estimateDailyFare } from "@/lib/fareCalendar";
import { formatMoney } from "@/lib/currency";
import { buildSearchQuery } from "@/lib/searchParams";

const REGION_GRADIENT: Record<AirportRegion, string> = {
  Pakistan: "from-brand-700 to-brand-400",
  GCC: "from-accent-600 to-accent-400",
  "Middle East": "from-brand-800 to-brand-500",
  "UK & Europe": "from-brand-900 to-brand-600",
  "North America": "from-brand-600 to-brand-400",
  "Asia Pacific": "from-accent-500 to-accent-400",
  Africa: "from-brand-700 to-accent-500",
};

const REGIONS: AirportRegion[] = [
  "GCC",
  "Middle East",
  "UK & Europe",
  "North America",
  "Asia Pacific",
  "Africa",
  "Pakistan",
];

function monthOptions() {
  const now = new Date();
  return Array.from({ length: 10 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 15);
    return {
      value: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-15`,
      label: d.toLocaleDateString("en-GB", { month: "long", year: "numeric" }),
    };
  });
}

export default function ExploreGrid() {
  const currency = useCurrency();
  const months = useMemo(() => monthOptions(), []);
  const [from, setFrom] = useState("KHI");
  const [month, setMonth] = useState(months[0].value);
  const [round, setRound] = useState(true);
  const [budget, setBudget] = useState(150000);
  const [region, setRegion] = useState<AirportRegion | "all">("all");

  const tripType = round ? "roundtrip" : "oneway";
  const monthLabel = months.find((m) => m.value === month)?.label ?? "";

  const results = useMemo(
    () =>
      airports
        .filter((a) => a.code !== from)
        .filter((a) => region === "all" || a.region === region)
        .map((a) => ({
          airport: a,
          price: estimateDailyFare({
            origin: from,
            destination: a.code,
            date: month,
            cabin: "Economy",
            tripType,
          }),
        }))
        .filter((r) => r.price > 0 && r.price <= budget)
        .sort((x, y) => x.price - y.price),
    [from, month, region, budget, tripType]
  );

  const queryFor = (destCode: string) =>
    buildSearchQuery({
      from,
      to: destCode,
      depart: month,
      ret: round ? `${month.slice(0, 8)}22` : undefined,
      tripType,
      cabin: "Economy",
      adults: 1,
      children: 0,
      infants: 0,
    });

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 lg:grid-cols-[1fr_1fr_1fr_1.4fr]">
        <AirportField
          label="From"
          value={from}
          onChange={setFrom}
          className="rounded-lg border border-slate-300 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100"
        />

        <label className="flex flex-col gap-1 rounded-lg px-3 py-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Month</span>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="bg-transparent font-heading text-base font-semibold text-brand-900 outline-none"
          >
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-col gap-1 rounded-lg px-3 py-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Trip</span>
          <div className="mt-0.5 flex gap-1 rounded-lg bg-brand-50 p-1 text-sm font-semibold">
            <button
              type="button"
              onClick={() => setRound(false)}
              className={`flex-1 rounded-md py-1 transition ${
                !round ? "bg-brand-600 text-white shadow-sm" : "text-slate-600"
              }`}
            >
              One way
            </button>
            <button
              type="button"
              onClick={() => setRound(true)}
              className={`flex-1 rounded-md py-1 transition ${
                round ? "bg-brand-600 text-white shadow-sm" : "text-slate-600"
              }`}
            >
              Round trip
            </button>
          </div>
        </div>

        <label className="flex flex-col gap-1 rounded-lg px-3 py-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Budget · up to {formatMoney(budget, currency)}
          </span>
          <input
            type="range"
            min={15000}
            max={400000}
            step={5000}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="mt-2 w-full accent-brand-600"
          />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          onClick={() => setRegion("all")}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
            region === "all" ? "bg-brand-600 text-white shadow-sm" : "bg-white text-slate-600 hover:text-brand-700"
          }`}
        >
          All regions
        </button>
        {REGIONS.map((r) => (
          <button
            key={r}
            onClick={() => setRegion(r)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              region === r ? "bg-brand-600 text-white shadow-sm" : "bg-white text-slate-600 hover:text-brand-700"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm text-slate-500">
        <strong className="font-heading text-brand-900">{results.length}</strong> destination
        {results.length === 1 ? "" : "s"} from {cityForCode(from)} · {round ? "round trip" : "one way"} ·{" "}
        {monthLabel} · under {formatMoney(budget, currency)}
      </p>

      {results.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          Nothing within this budget yet — raise it, pick a different month, or widen the region.
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {results.map(({ airport: a, price }, i) => (
            <Link
              key={a.code}
              href={`/search?${queryFor(a.code)}`}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-950/10"
            >
              <div
                className={`relative flex h-24 items-end bg-gradient-to-br ${REGION_GRADIENT[a.region]} p-3`}
              >
                <span className="font-heading text-lg font-bold leading-tight text-white">
                  {a.city}
                </span>
                {i === 0 && (
                  <span className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-brand-800">
                    Best value
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="flex items-center gap-1 text-xs text-slate-400">
                  <MapPin size={11} />
                  {a.country}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  from{" "}
                  <Price pkr={price} className="font-heading font-bold text-accent-600" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <p className="mt-6 text-[11px] text-slate-400">
        Prices are indicative estimates for a mid-month departure in Economy — tap a destination to
        run a live search.
      </p>
    </section>
  );
}
