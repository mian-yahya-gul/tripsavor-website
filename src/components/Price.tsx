"use client";

import { useSyncExternalStore } from "react";
import {
  type CurrencyCode,
  formatMoney,
  formatMoneyShort,
  getCurrencyServerSnapshot,
  getCurrencySnapshot,
  subscribeCurrency,
} from "@/lib/currency";

export function useCurrency(): CurrencyCode {
  return useSyncExternalStore(
    subscribeCurrency,
    getCurrencySnapshot,
    getCurrencyServerSnapshot
  );
}

export default function Price({
  pkr,
  short = false,
  className,
}: {
  pkr: number;
  short?: boolean;
  className?: string;
}) {
  const code = useCurrency();
  return (
    <span className={className}>
      {short ? formatMoneyShort(pkr, code) : formatMoney(pkr, code)}
    </span>
  );
}
