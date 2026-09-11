"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarRange } from "lucide-react";
import { estimateDailyFare } from "@/lib/fareCalendar";
import { formatMoneyShort } from "@/lib/currency";
import { useCurrency } from "@/components/Price";
import { buildSearchQuery } from "@/lib/searchParams";
import type { Cabin, TripType } from "@/lib/fares/types";

type Props = {
  origin: string;
  destination: string;
  departDate: string;
  returnDate?: string;
  tripType: TripType;
  cabin: Cabin;
  adults: number;
  childCount: number;
  infants: number;
};

const OFFSETS = [-3, -2, -1, 0, 1, 2, 3];

function pad(n: number) {
  return String(n).padStart(2, "0");
}
function toISO(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function shift(iso: string, days: number) {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  return toISO(d);
}

export default function FlexDateStrip({
  origin,
  destination,
  departDate,
  returnDate,
  tripType,
  cabin,
  adults,
  childCount,
  infants,
}: Props) {
  const currency = useCurrency();
  const [todayIso] = useState(() => toISO(new Date()));

  const columns = useMemo(() => {
    const cols = OFFSETS.map((offset) => {
      const depart = shift(departDate, offset);
      const ret =
        tripType === "roundtrip" && returnDate ? shift(returnDate, offset) : undefined;
      const disabled = depart < todayIso;
      const price = disabled
        ? 0
        : estimateDailyFare({ origin, destination, date: depart, cabin, tripType });
      const d = new Date(`${depart}T00:00:00`);
      return {
        offset,
        depart,
        disabled,
        price,
        selected: offset === 0,
        weekday: d.toLocaleDateString("en-GB", { weekday: "short" }),
        dayMonth: d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
        query: buildSearchQuery({
          from: origin,
          to: destination,
          depart,
          ret,
          tripType,
          cabin,
          adults,
          children: childCount,
          infants,
        }),
      };
    });
    const cheapest = cols.reduce(
      (lo, c) => (!c.disabled && c.price > 0 && c.price < lo ? c.price : lo),
      Number.POSITIVE_INFINITY
    );
    return cols.map((c) => ({ ...c, cheapest: !c.selected && c.price === cheapest }));
  }, [
    origin,
    destination,
    departDate,
    returnDate,
    tripType,
    cabin,
    adults,
    childCount,
    infants,
    todayIso,
  ]);

  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-400">
          <CalendarRange size={13} />
          Nearby dates
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {columns.map((c) =>
            c.disabled ? (
              <div
                key={c.offset}
                className="min-w-[4.75rem] flex-1 rounded-xl border border-dashed border-slate-200 px-2 py-2.5 text-center opacity-40"
              >
                <p className="text-xs font-semibold text-slate-500">{c.weekday}</p>
                <p className="text-[11px] text-slate-400">{c.dayMonth}</p>
                <p className="mt-1 text-sm text-slate-300">—</p>
              </div>
            ) : (
              <Link
                key={c.offset}
                href={`/search?${c.query}`}
                prefetch
                aria-current={c.selected ? "page" : undefined}
                className={`min-w-[4.75rem] flex-1 rounded-xl border px-2 py-2.5 text-center transition ${
                  c.selected
                    ? "border-brand-600 bg-brand-600 text-white"
                    : c.cheapest
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      : "border-slate-200 text-slate-600 hover:border-brand-300 hover:bg-brand-50"
                }`}
              >
                <p className="text-xs font-semibold">{c.weekday}</p>
                <p className={`text-[11px] ${c.selected ? "text-white/80" : "text-slate-400"}`}>
                  {c.dayMonth}
                </p>
                <p className="mt-1 font-heading text-sm font-bold">
                  {formatMoneyShort(c.price, currency)}
                </p>
              </Link>
            )
          )}
        </div>
        <p className="mt-2 text-[11px] text-slate-400">
          Tap a date to shift your trip — estimates in {currency}
          {tripType === "roundtrip" && returnDate ? "; your return moves with it" : ""}.
        </p>
      </div>
    </div>
  );
}
