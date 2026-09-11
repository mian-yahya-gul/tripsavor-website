"use client";

import { BarChart3 } from "lucide-react";
import type { FlightOffer } from "@/lib/fares/types";
import { TIME_BUCKETS, minutesOf } from "@/lib/timeBuckets";
import { formatMoney, formatMoneyShort } from "@/lib/currency";
import { useCurrency } from "@/components/Price";

type Props = {
  offers: FlightOffer[];
  activeBuckets: Set<string>;
  onToggle: (id: string) => void;
};

const BAR_MIN = 16;
const BAR_MAX = 68;

export default function DepartureTimeChart({ offers, activeBuckets, onToggle }: Props) {
  const currency = useCurrency();
  const stats = TIME_BUCKETS.map((b) => {
    const inWindow = offers.filter((o) => {
      const m = minutesOf(o.departTime);
      return m >= b.from && m < b.to;
    });
    const min = inWindow.length ? Math.min(...inWindow.map((o) => o.price)) : null;
    return { ...b, min, count: inWindow.length };
  });

  const priced = stats.filter((s) => s.min !== null) as (typeof stats[number] & { min: number })[];
  if (priced.length === 0) return null;

  const lo = Math.min(...priced.map((s) => s.min));
  const hi = Math.max(...priced.map((s) => s.min));
  const barHeight = (p: number) =>
    hi === lo ? BAR_MAX : BAR_MIN + ((p - lo) / (hi - lo)) * (BAR_MAX - BAR_MIN);

  return (
    <div
      className="mb-4 rounded-xl border border-slate-200 bg-white p-4"
      role="group"
      aria-label="Fares by departure time — tap a window to filter"
    >
      <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-400">
        <BarChart3 size={13} />
        Fares by departure time
      </p>

      <div className="flex items-end gap-2">
        {stats.map((s) => {
          const active = activeBuckets.has(s.id);
          const isLow = s.min !== null && s.min === lo && hi !== lo;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onToggle(s.id)}
              aria-pressed={active}
              aria-label={
                s.min !== null
                  ? `${s.label}, from ${formatMoney(s.min, currency)}, ${s.count} flight${
                      s.count > 1 ? "s" : ""
                    }`
                  : `${s.label}, no flights`
              }
              title={
                s.min !== null
                  ? `${s.label} — from ${formatMoney(s.min, currency)}`
                  : `${s.label} — no flights`
              }
              className="group flex flex-1 flex-col items-center justify-end gap-1"
            >
              <span
                className={`text-[10px] font-bold transition ${
                  isLow ? "text-emerald-600" : "text-slate-500"
                } ${
                  active || isLow ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus:opacity-100"
                }`}
              >
                {s.min !== null ? formatMoneyShort(s.min, currency) : "—"}
              </span>
              <span
                style={{ height: `${s.min !== null ? barHeight(s.min) : 8}px` }}
                className={`w-full max-w-[3rem] rounded-t transition-colors ${
                  s.min === null
                    ? "bg-slate-100"
                    : active
                      ? "bg-brand-600"
                      : isLow
                        ? "bg-emerald-400 group-hover:bg-emerald-500"
                        : "bg-brand-200 group-hover:bg-brand-300"
                }`}
              />
            </button>
          );
        })}
      </div>

      <div className="mt-1.5 flex gap-2">
        {stats.map((s) => (
          <span
            key={s.id}
            className={`flex-1 text-center text-[10px] font-semibold ${
              activeBuckets.has(s.id) ? "text-brand-700" : "text-slate-400"
            }`}
          >
            {s.short}
          </span>
        ))}
      </div>
    </div>
  );
}
