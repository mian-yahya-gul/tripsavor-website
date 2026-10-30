"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import Price, { useCurrency } from "@/components/Price";
import { airports } from "@/data/airports";
import { CITY_PHOTOS } from "@/data/cityPhotos";
import { estimateDailyFare } from "@/lib/fareCalendar";
import { formatMoney } from "@/lib/currency";
import { buildSearchQuery } from "@/lib/searchParams";

const PRESETS = [50000, 100000, 150000, 250000];

function monthOptions() {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 15);
    return {
      value: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-15`,
      label: d.toLocaleDateString("en-GB", { month: "short", year: "numeric" }),
    };
  });
}

/** Homepage "Where can I go for my budget?" — ranks destinations by estimated fare from Karachi. */
export default function BudgetPlanner() {
  const currency = useCurrency();
  const months = useMemo(() => monthOptions(), []);
  const [budget, setBudget] = useState(100000);
  const [month, setMonth] = useState(months[0].value);

  const results = useMemo(
    () =>
      airports
        .filter((a) => a.code !== "KHI" && a.region !== "Pakistan")
        .map((a) => ({
          airport: a,
          price: estimateDailyFare({
            origin: "KHI",
            destination: a.code,
            date: month,
            cabin: "Economy",
            tripType: "roundtrip",
          }),
        }))
        .filter((r) => r.price > 0 && r.price <= budget)
        // Photo-backed destinations first, then cheapest.
        .sort(
          (x, y) =>
            Number(y.airport.code in CITY_PHOTOS) - Number(x.airport.code in CITY_PHOTOS) ||
            x.price - y.price
        ),
    [budget, month]
  );

  const shown = results.slice(0, 6);

  return (
    <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-950 via-brand-900 to-brand-700 p-5 text-white shadow-xl shadow-brand-950/20 sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,320px)_1fr]">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-400">
            <Sparkles size={12} /> Budget planner
          </span>
          <h3 className="mt-3 font-heading text-2xl font-extrabold leading-tight sm:text-3xl">
            Where can I go for{" "}
            <span className="text-accent-400">{formatMoney(budget, currency)}</span>?
          </h3>
          <p className="mt-2 text-sm text-brand-100/80">
            Set your return-ticket budget from Karachi and see every place you can fly.
          </p>

          <input
            type="range"
            min={30000}
            max={400000}
            step={5000}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            aria-label="Budget"
            className="mt-6 w-full accent-accent-500"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setBudget(p)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  budget === p ? "bg-accent-500 text-brand-950" : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {formatMoney(p, currency)}
              </button>
            ))}
          </div>

          <label className="mt-5 block text-xs font-semibold uppercase tracking-wide text-brand-100/70">
            Travelling in
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-white/20 bg-brand-950/60 px-3 py-2 text-sm font-semibold normal-case tracking-normal text-white outline-none focus:border-accent-400"
            >
              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </label>

          <p className="mt-5 text-sm text-brand-100/80">
            <strong className="font-heading text-xl text-white">{results.length}</strong>{" "}
            destination{results.length === 1 ? "" : "s"} within budget
          </p>
          <Link
            href="/explore"
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-accent-400 transition hover:text-accent-300"
          >
            See all on the explore map <ArrowRight size={14} />
          </Link>
        </div>

        {shown.length === 0 ? (
          <div className="flex items-center justify-center rounded-2xl border border-dashed border-white/20 p-10 text-center text-sm text-brand-100/80">
            Nothing at this budget yet — nudge the slider up a little.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {shown.map(({ airport: a, price }) => {
              const photo = CITY_PHOTOS[a.code];
              return (
                <Link
                  key={a.code}
                  href={`/search?${buildSearchQuery({
                    from: "KHI",
                    to: a.code,
                    depart: month,
                    ret: `${month.slice(0, 8)}22`,
                    tripType: "roundtrip",
                    cabin: "Economy",
                    adults: 1,
                    children: 0,
                    infants: 0,
                  })}`}
                  className="group relative isolate aspect-[4/5] overflow-hidden rounded-2xl bg-brand-800 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30"
                >
                  {photo ? (
                    <Image
                      src={photo}
                      alt={a.city}
                      fill
                      sizes="(min-width:640px) 22vw, 45vw"
                      className="object-cover transition duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-600 to-brand-800" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3">
                    <p className="flex items-center gap-1 truncate text-[10px] font-semibold uppercase tracking-wide text-white/70">
                      <MapPin size={10} />
                      {a.country}
                    </p>
                    <p className="font-heading text-base font-bold">{a.city}</p>
                    <Price pkr={price} className="text-sm font-bold text-accent-400" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      <p className="mt-5 text-[11px] text-brand-100/60">
        Indicative round-trip economy estimates from Karachi — tap a destination for a live search.
      </p>
    </div>
  );
}
