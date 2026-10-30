"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { BellRing, TrendingDown, TrendingUp, X } from "lucide-react";
import Price from "@/components/Price";
import { cityForCode } from "@/data/airports";
import { estimateDailyFare } from "@/lib/fareCalendar";
import {
  getWatchServerSnapshot,
  getWatchSnapshot,
  removeWatch,
  subscribeWatch,
} from "@/lib/priceWatch";
import { useT } from "@/lib/i18n";
import { buildSearchQuery } from "@/lib/searchParams";

/** Homepage strip: routes the visitor is watching, with movement since they saved them. */
export default function WatchedRoutes() {
  const list = useSyncExternalStore(subscribeWatch, getWatchSnapshot, getWatchServerSnapshot);
  const t = useT();
  if (list.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
      <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-brand-950">
        <BellRing size={18} className="text-accent-500" /> {t("Your watched fares")}
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((w) => {
          const now = estimateDailyFare({
            origin: w.from,
            destination: w.to,
            date: w.depart,
            cabin: w.cabin,
            tripType: w.tripType,
          });
          const delta = now > 0 ? Math.round(((now - w.savedPrice) / w.savedPrice) * 100) : 0;
          const down = delta < 0;
          return (
            <div key={w.id} className="relative rounded-2xl border border-slate-200 bg-white p-4">
              <button
                type="button"
                aria-label="Stop watching"
                onClick={() => removeWatch(w.id)}
                className="absolute right-2 top-2 rounded-full p-1 text-slate-300 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={14} />
              </button>
              <p className="font-heading text-base font-bold text-brand-950">
                {cityForCode(w.from)} → {cityForCode(w.to)}
              </p>
              <p className="text-xs text-slate-400">{w.depart}{w.ret ? ` – ${w.ret}` : ""}</p>
              <div className="mt-3 flex items-end justify-between">
                <div>
                  <Price pkr={now || w.savedPrice} className="font-heading text-lg font-extrabold text-brand-950" />
                  <p className="text-[11px] text-slate-400">
                    saved at <Price pkr={w.savedPrice} />
                  </p>
                </div>
                {delta !== 0 && (
                  <span
                    className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold ${
                      down ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
                    }`}
                  >
                    {down ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
                    {Math.abs(delta)}%
                  </span>
                )}
              </div>
              <Link
                href={`/search?${buildSearchQuery({
                  from: w.from,
                  to: w.to,
                  depart: w.depart,
                  ret: w.ret,
                  tripType: w.tripType,
                  cabin: w.cabin,
                  adults: 1,
                  children: 0,
                  infants: 0,
                })}`}
                className="mt-3 block text-sm font-bold text-brand-700 hover:text-brand-900"
              >
                {t("Check live fares →")}
              </Link>
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-[11px] text-slate-400">
        Fares are checked when you visit — saved on this device only.
      </p>
    </section>
  );
}
