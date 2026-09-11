"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { getAirport, searchAirports, type Airport } from "@/data/airports";

type Props = {
  label: string;
  /** Selected IATA code. */
  value: string;
  onChange: (code: string) => void;
  /** IATA code to hide from results (e.g. the opposite field). */
  exclude?: string;
  className?: string;
};

export default function AirportField({ label, value, onChange, exclude, className = "" }: Props) {
  const selected = getAirport(value);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const results = useMemo(
    () => searchAirports(open ? query : "", { exclude, limit: 7 }),
    [open, query, exclude]
  );

  useEffect(() => {
    if (!open) return;
    function onDocPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("pointerdown", onDocPointerDown);
    return () => document.removeEventListener("pointerdown", onDocPointerDown);
  }, [open]);

  function commit(airport: Airport) {
    onChange(airport.code);
    setOpen(false);
    setQuery("");
    inputRef.current?.blur();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        e.preventDefault();
        setOpen(true);
        setActiveIndex(0);
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => Math.min(results.length - 1, i + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => Math.max(0, i - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (results[activeIndex]) commit(results[activeIndex]);
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        setQuery("");
        break;
      case "Tab":
        setOpen(false);
        setQuery("");
        break;
    }
  }

  const displayValue = open
    ? query
    : selected
      ? `${selected.city} (${selected.code})`
      : "";

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <div className="flex flex-col gap-0.5 rounded-lg px-3 py-2 transition hover:bg-brand-50">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span>
        <input
          ref={inputRef}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-label={label}
          aria-activedescendant={
            open && results[activeIndex] ? `${listId}-opt-${activeIndex}` : undefined
          }
          value={displayValue}
          placeholder="City or airport"
          onFocus={() => {
            setOpen(true);
            setQuery("");
            setActiveIndex(0);
          }}
          onChange={(e) => {
            setOpen(true);
            setQuery(e.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent font-heading text-base font-semibold text-brand-900 outline-none placeholder:font-sans placeholder:text-sm placeholder:font-normal placeholder:text-slate-400"
        />
        <span className="truncate text-[11px] text-slate-400">
          {selected ? `${selected.name} · ${selected.country}` : " "}
        </span>
      </div>

      {open && (
        <ul
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 z-30 mt-1 max-h-64 overflow-auto rounded-xl border border-slate-200 bg-white py-1 text-left shadow-xl shadow-brand-950/10"
        >
          {results.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-slate-400">
              No airports match &ldquo;{query}&rdquo;.
            </li>
          ) : (
            <>
              {!query && (
                <li className="px-3 pb-1 pt-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Popular
                </li>
              )}
              {results.map((airport, i) => (
                <li
                  key={airport.code}
                  id={`${listId}-opt-${i}`}
                  role="option"
                  aria-selected={airport.code === value}
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    commit(airport);
                  }}
                  className={`flex cursor-pointer items-center gap-3 px-3 py-2 ${
                    i === activeIndex ? "bg-brand-50" : ""
                  }`}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <MapPin size={15} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate font-heading text-sm font-bold text-brand-950">
                        {airport.city}
                      </span>
                      <span className="shrink-0 text-xs text-slate-400">{airport.country}</span>
                    </span>
                    <span className="block truncate text-xs text-slate-400">{airport.name}</span>
                  </span>
                  <span className="shrink-0 rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-xs font-bold text-slate-500">
                    {airport.code}
                  </span>
                </li>
              ))}
            </>
          )}
        </ul>
      )}
    </div>
  );
}
