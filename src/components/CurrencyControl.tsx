"use client";

import { CURRENCIES, CURRENCY_CODES, setCurrency, type CurrencyCode } from "@/lib/currency";
import { useCurrency } from "@/components/Price";

export default function CurrencyControl() {
  const code = useCurrency();
  return (
    <label className="flex items-center gap-1">
      <span className="sr-only">Currency</span>
      <select
        value={code}
        onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
        className="cursor-pointer rounded bg-transparent py-0.5 pr-1 text-xs font-semibold text-brand-100 outline-none hover:text-accent-400"
      >
        {CURRENCY_CODES.map((c) => (
          <option key={c} value={c} className="text-slate-900">
            {CURRENCIES[c].label}
          </option>
        ))}
      </select>
    </label>
  );
}
