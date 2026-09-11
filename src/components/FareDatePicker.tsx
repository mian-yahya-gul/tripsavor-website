"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { estimateDailyFare } from "@/lib/fareCalendar";
import { formatMoney, formatMoneyShort } from "@/lib/currency";
import { useCurrency } from "@/components/Price";
import type { Cabin, TripType } from "@/lib/fares/types";

type Props = {
  label: string;
  /** yyyy-mm-dd or "" */
  value: string;
  onChange: (iso: string) => void;
  /** Earliest selectable day, yyyy-mm-dd. Defaults to today. */
  min?: string;
  origin: string;
  destination: string;
  cabin: Cabin;
  tripType: TripType;
  disabled?: boolean;
  align?: "left" | "right";
  invalid?: boolean;
};

const MONTHS_AHEAD = 11;
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function pad(n: number) {
  return String(n).padStart(2, "0");
}
function toISO(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function fromISO(iso: string) {
  return new Date(`${iso}T00:00:00`);
}
function addDays(d: Date, n: number) {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}
function monthIndex(d: Date) {
  return d.getFullYear() * 12 + d.getMonth();
}

export default function FareDatePicker({
  label,
  value,
  onChange,
  min,
  origin,
  destination,
  cabin,
  tripType,
  disabled = false,
  align = "left",
  invalid = false,
}: Props) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const minDate = useMemo(() => (min ? fromISO(min) : today), [min, today]);
  const minMonth = monthIndex(minDate);
  const maxMonth = monthIndex(today) + MONTHS_AHEAD;

  const currency = useCurrency();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => fromISO(value || toISO(minDate)));
  const [focusIso, setFocusIso] = useState(value || toISO(minDate));
  const rootRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const dialogId = useId();

  const viewMonthIdx = monthIndex(view);
  const canPrev = viewMonthIdx > minMonth;
  const canNext = viewMonthIdx < maxMonth;

  const openPicker = () => {
    const anchor = value || toISO(minDate);
    setView(fromISO(anchor));
    setFocusIso(anchor);
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Move DOM focus to the active day whenever keyboard navigation changes it.
  useEffect(() => {
    if (!open) return;
    gridRef.current
      ?.querySelector<HTMLButtonElement>(`[data-iso="${focusIso}"]`)
      ?.focus();
  }, [focusIso, open, view]);

  const cells = useMemo(() => {
    const first = new Date(view.getFullYear(), view.getMonth(), 1);
    const gridStart = addDays(first, -first.getDay());
    const minIso = toISO(minDate);

    const list = Array.from({ length: 42 }, (_, i) => {
      const date = addDays(gridStart, i);
      const iso = toISO(date);
      const inMonth = date.getMonth() === view.getMonth();
      const selectable = inMonth && iso >= minIso;
      const price = selectable
        ? estimateDailyFare({ origin, destination, date: iso, cabin, tripType })
        : 0;
      return {
        iso,
        day: date.getDate(),
        inMonth,
        selectable,
        price,
        isToday: iso === toISO(today),
      };
    });

    const cheapest = list.reduce(
      (lo, c) => (c.selectable && c.price > 0 && c.price < lo ? c.price : lo),
      Number.POSITIVE_INFINITY
    );
    return { list, cheapest };
  }, [view, minDate, origin, destination, cabin, tripType, today]);

  const shiftMonth = (delta: number) => {
    setView((v) => {
      const nextIdx = monthIndex(v) + delta;
      if (nextIdx < minMonth || nextIdx > maxMonth) return v;
      return new Date(v.getFullYear(), v.getMonth() + delta, 1);
    });
  };

  const moveFocus = (deltaDays: number) => {
    const nextIso = toISO(addDays(fromISO(focusIso), deltaDays));
    if (nextIso < toISO(minDate)) return;
    const next = fromISO(nextIso);
    if (monthIndex(next) > maxMonth) return;
    setFocusIso(nextIso);
    if (monthIndex(next) !== monthIndex(view)) {
      setView(new Date(next.getFullYear(), next.getMonth(), 1));
    }
  };

  const onGridKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        moveFocus(-1);
        break;
      case "ArrowRight":
        e.preventDefault();
        moveFocus(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        moveFocus(-7);
        break;
      case "ArrowDown":
        e.preventDefault();
        moveFocus(7);
        break;
      case "PageUp":
        e.preventDefault();
        shiftMonth(-1);
        break;
      case "PageDown":
        e.preventDefault();
        shiftMonth(1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (focusIso >= toISO(minDate)) {
          onChange(focusIso);
          setOpen(false);
        }
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
    }
  };

  const selectedLabel = value
    ? fromISO(value).toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
      })
    : "Add date";

  const selectedFare = value
    ? estimateDailyFare({ origin, destination, date: value, cabin, tripType })
    : 0;

  return (
    <div ref={rootRef} className={`relative ${disabled ? "opacity-40" : ""}`}>
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={dialogId}
        onClick={() => (open ? setOpen(false) : openPicker())}
        className={`flex w-full flex-col gap-0.5 rounded-lg px-3 py-2 text-left transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:hover:bg-transparent ${
          invalid ? "ring-1 ring-inset ring-red-400" : ""
        }`}
      >
        <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
          <CalendarDays size={12} /> {label}
        </span>
        <span className="font-heading text-base font-semibold text-brand-900">{selectedLabel}</span>
        <span className="truncate text-[11px] text-slate-400">
          {selectedFare > 0 ? `est. ${formatMoneyShort(selectedFare, currency)}` : " "}
        </span>
      </button>

      {open && !disabled && (
        <div
          id={dialogId}
          role="dialog"
          aria-label={`Choose ${label.toLowerCase()} date`}
          className={`absolute top-full z-30 mt-1 w-[19rem] max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200 bg-white p-3 shadow-xl shadow-brand-950/15 ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              disabled={!canPrev}
              aria-label="Previous month"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-brand-700 transition hover:bg-brand-50 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="font-heading text-sm font-bold text-brand-950">
              {view.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
            </span>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              disabled={!canNext}
              aria-label="Next month"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-brand-700 transition hover:bg-brand-50 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-7 text-center text-[10px] font-bold uppercase tracking-wide text-slate-400">
            {WEEKDAYS.map((d) => (
              <span key={d} className="py-1">
                {d}
              </span>
            ))}
          </div>

          <div ref={gridRef} className="grid grid-cols-7 gap-0.5" onKeyDown={onGridKeyDown}>
            {cells.list.map((c) => {
              if (!c.inMonth) return <span key={c.iso} aria-hidden />;
              const isSelected = c.iso === value;
              const isCheapest =
                c.selectable && c.price > 0 && c.price === cells.cheapest && !isSelected;
              return (
                <button
                  key={c.iso}
                  type="button"
                  data-iso={c.iso}
                  disabled={!c.selectable}
                  tabIndex={c.iso === focusIso ? 0 : -1}
                  aria-pressed={isSelected}
                  aria-label={`${fromISO(c.iso).toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}${c.price ? `, estimated ${formatMoney(c.price, currency)}` : ""}`}
                  onClick={() => {
                    onChange(c.iso);
                    setOpen(false);
                  }}
                  className={`flex h-11 flex-col items-center justify-center rounded-lg text-xs transition disabled:cursor-not-allowed disabled:text-slate-300 ${
                    isSelected
                      ? "bg-brand-600 text-white"
                      : isCheapest
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        : "text-slate-700 hover:bg-brand-50"
                  } ${c.isToday && !isSelected ? "ring-1 ring-inset ring-brand-300" : ""}`}
                >
                  <span className="font-heading font-bold leading-none">{c.day}</span>
                  {c.price > 0 && (
                    <span
                      className={`mt-0.5 text-[9px] leading-none ${
                        isSelected ? "text-white/80" : isCheapest ? "text-emerald-600" : "text-slate-400"
                      }`}
                    >
                      {formatMoneyShort(c.price, currency)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <p className="mt-2 flex items-center gap-1.5 border-t border-slate-100 pt-2 text-[11px] text-slate-400">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-100 ring-1 ring-emerald-300" />
            Lowest fare this month · estimates in {currency}
          </p>
        </div>
      )}
    </div>
  );
}
