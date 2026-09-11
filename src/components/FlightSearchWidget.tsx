"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftRight, ChevronDown, History, MapPin, Plus, Search, Users, X } from "lucide-react";
import AirportField from "@/components/AirportField";
import FareDatePicker from "@/components/FareDatePicker";
import {
  addRecentSearch,
  clearRecentSearches,
  getRecentSearchesServerSnapshot,
  getRecentSearchesSnapshot,
  subscribeRecentSearches,
  type RecentSearch,
} from "@/lib/recentSearches";
import { buildSearchQuery, type MultiCityLeg } from "@/lib/searchParams";
import { detectOriginFromTimeZone, getPreferredOrigin, setPreferredOrigin } from "@/lib/originPref";
import { track } from "@/lib/analytics";
import { getAirport } from "@/data/airports";

const MAX_LEGS = 5;

type TripType = "oneway" | "roundtrip" | "multicity";
type Cabin = "Economy" | "Business";

function fmtDay(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function addDaysIso(iso: string, days: number) {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

const RETURN_GAP_DAYS = 7;

export default function FlightSearchWidget() {
  const router = useRouter();
  const [tripType, setTripType] = useState<TripType>("roundtrip");
  const [from, setFrom] = useState("KHI");
  const [to, setTo] = useState("DXB");
  const [depart, setDepart] = useState("");
  const [ret, setRet] = useState("");
  const [cabin, setCabin] = useState<Cabin>("Economy");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [travelersOpen, setTravelersOpen] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [multiError, setMultiError] = useState(false);
  const [autoOrigin, setAutoOrigin] = useState(false);

  useEffect(() => {
    // Resolve a preferred / geo-detected origin once, after mount, so SSR and the
    // hydration render both use the "KHI" default and never mismatch.
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      const pref = getPreferredOrigin();
      if (pref && getAirport(pref)) {
        setFrom(pref);
        return;
      }
      const detected = detectOriginFromTimeZone();
      if (detected && getAirport(detected) && detected !== "KHI") {
        setFrom(detected);
        setAutoOrigin(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);
  const [legs, setLegs] = useState<MultiCityLeg[]>([
    { from: "KHI", to: "DXB", depart: "" },
    { from: "DXB", to: "IST", depart: "" },
  ]);
  const recents = useSyncExternalStore(
    subscribeRecentSearches,
    getRecentSearchesSnapshot,
    getRecentSearchesServerSnapshot
  );

  const chooseTripType = (t: TripType) => {
    setTripType(t);
    if (t === "roundtrip" && depart && !ret) setRet(addDaysIso(depart, RETURN_GAP_DAYS));
  };

  const handleDepartChange = (iso: string) => {
    setDepart(iso);
    setDateError(false);
    if (tripType === "roundtrip") {
      if (!ret || ret <= iso) setRet(addDaysIso(iso, RETURN_GAP_DAYS));
    } else if (ret && ret < iso) {
      setRet("");
    }
  };

  const updateLeg = (index: number, patch: Partial<MultiCityLeg>) =>
    setLegs((ls) => ls.map((l, i) => (i === index ? { ...l, ...patch } : l)));
  const addLeg = () =>
    setLegs((ls) =>
      ls.length >= MAX_LEGS ? ls : [...ls, { from: ls[ls.length - 1].to, to: "", depart: "" }]
    );
  const removeLeg = (index: number) =>
    setLegs((ls) => (ls.length <= 2 ? ls : ls.filter((_, i) => i !== index)));

  const handleSearch = () => {
    if (tripType === "multicity") {
      const clean = legs.filter((l) => l.from && l.to && l.depart && l.from !== l.to);
      if (clean.length < 2) {
        setMultiError(true);
        return;
      }
      setMultiError(false);
      const first = clean[0];
      setPreferredOrigin(first.from);
      track("search", { tripType, from: first.from, to: clean[clean.length - 1].to, legs: clean.length });
      router.push(
        `/search?${buildSearchQuery({
          from: first.from,
          to: first.to,
          depart: first.depart,
          tripType,
          cabin,
          adults,
          children,
          infants,
          legs: clean,
        })}`
      );
      return;
    }
    if (!depart) {
      setDateError(true);
      return;
    }
    setDateError(false);
    const entry = {
      from,
      to,
      depart,
      ret: tripType === "roundtrip" && ret ? ret : undefined,
      tripType,
      cabin,
      adults,
      children,
      infants,
    };
    setPreferredOrigin(from);
    track("search", { tripType, from, to, cabin, pax: adults + children + infants });
    addRecentSearch(entry);
    router.push(`/search?${buildSearchQuery(entry)}`);
  };

  const applyRecent = (r: RecentSearch) => {
    setTripType(r.tripType);
    setFrom(r.from);
    setTo(r.to);
    setDepart(r.depart);
    setRet(r.ret ?? "");
    setCabin(r.cabin);
    setAdults(r.adults);
    setChildren(r.children);
    setInfants(r.infants);
    addRecentSearch(r);
    router.push(`/search?${buildSearchQuery(r)}`);
  };

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const travelerLabel = `${adults + children} Traveler${adults + children > 1 ? "s" : ""}, ${cabin}`;

  return (
    <div className="w-full rounded-2xl bg-white p-4 shadow-xl shadow-brand-950/10 sm:p-6">
      <div className="mb-5 flex flex-wrap gap-1 rounded-lg bg-brand-50 p-1 text-sm font-semibold">
        {(
          [
            ["oneway", "One Way"],
            ["roundtrip", "Round Trip"],
            ["multicity", "Multi-City"],
          ] as [TripType, string][]
        ).map(([value, label]) => (
          <button
            key={value}
            onClick={() => chooseTripType(value)}
            className={`rounded-md px-4 py-1.5 transition ${
              tripType === value ? "bg-brand-600 text-white shadow-sm" : "text-slate-600 hover:text-brand-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        {tripType === "multicity" ? (
          <div className="space-y-3 lg:col-span-9">
            {legs.map((leg, i) => (
              <div key={i} className="relative rounded-xl border border-slate-200 p-1">
                <div className="grid grid-cols-1 gap-1 sm:grid-cols-3">
                  <AirportField
                    label={`Flight ${i + 1} · From`}
                    value={leg.from}
                    onChange={(v) => updateLeg(i, { from: v })}
                    exclude={leg.to}
                  />
                  <AirportField
                    label="To"
                    value={leg.to}
                    onChange={(v) => updateLeg(i, { to: v })}
                    exclude={leg.from}
                  />
                  <FareDatePicker
                    label="Depart"
                    value={leg.depart}
                    onChange={(v) => {
                      updateLeg(i, { depart: v });
                      setMultiError(false);
                    }}
                    min={i > 0 ? legs[i - 1].depart || undefined : undefined}
                    origin={leg.from}
                    destination={leg.to}
                    cabin={cabin}
                    tripType="oneway"
                    align="right"
                  />
                </div>
                {legs.length > 2 && (
                  <button
                    onClick={() => removeLeg(i)}
                    aria-label={`Remove flight ${i + 1}`}
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm transition hover:text-red-600"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            ))}
            {legs.length < MAX_LEGS && (
              <button
                onClick={addLeg}
                className="flex items-center gap-2 rounded-xl border border-dashed border-brand-300 px-4 py-2.5 text-sm font-bold text-brand-700 transition hover:bg-brand-50"
              >
                <Plus size={15} />
                Add another flight
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="relative grid grid-cols-1 gap-3 rounded-xl border border-slate-200 p-1 sm:grid-cols-2 lg:col-span-5">
              <AirportField
                label="From"
                value={from}
                onChange={(v) => {
                  setFrom(v);
                  setAutoOrigin(false);
                }}
                exclude={to}
              />
              <AirportField label="To" value={to} onChange={setTo} exclude={from} />
              <button
                onClick={swap}
                aria-label="Swap origin and destination"
                className="absolute left-1/2 top-1/2 z-20 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-brand-600 shadow-sm transition hover:bg-brand-600 hover:text-white max-sm:rotate-90"
              >
                <ArrowLeftRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-200 p-1 lg:col-span-4">
              <FareDatePicker
                label="Depart"
                value={depart}
                onChange={handleDepartChange}
                origin={from}
                destination={to}
                cabin={cabin}
                tripType={tripType}
                invalid={dateError}
              />
              <FareDatePicker
                label="Return"
                value={ret}
                onChange={setRet}
                min={depart || undefined}
                origin={to}
                destination={from}
                cabin={cabin}
                tripType={tripType}
                disabled={tripType !== "roundtrip"}
                align="right"
              />
            </div>
          </>
        )}

        <div className="relative lg:col-span-3">
          <button
            onClick={() => setTravelersOpen((v) => !v)}
            className="flex h-full w-full items-center justify-between gap-2 rounded-xl border border-slate-200 px-4 py-3 text-left hover:bg-brand-50"
          >
            <span className="flex items-center gap-2">
              <Users size={16} className="text-brand-600" />
              <span className="font-heading text-sm font-semibold text-brand-900">{travelerLabel}</span>
            </span>
            <ChevronDown size={16} className="text-slate-400" />
          </button>

          {travelersOpen && (
            <div className="absolute right-0 top-full z-10 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
              {[
                ["Adults", "12+ years", adults, setAdults, 1],
                ["Children", "2-11 years", children, setChildren, 0],
                ["Infants", "Under 2 years", infants, setInfants, 0],
              ].map(([label, sub, val, setter, min]) => (
                <div key={label as string} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{label as string}</p>
                    <p className="text-xs text-slate-400">{sub as string}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => (setter as (fn: (n: number) => number) => void)((n) => Math.max(min as number, n - 1))}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 text-slate-600 hover:border-brand-600 hover:text-brand-600"
                    >
                      −
                    </button>
                    <span className="w-4 text-center text-sm font-semibold">{val as number}</span>
                    <button
                      onClick={() => (setter as (fn: (n: number) => number) => void)((n) => Math.min(9, n + 1))}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 text-slate-600 hover:border-brand-600 hover:text-brand-600"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
              <div className="mt-2 border-t border-slate-100 pt-3">
                <p className="mb-2 text-sm font-semibold text-slate-800">Cabin Class</p>
                <div className="flex gap-2">
                  {(["Economy", "Business"] as Cabin[]).map((c) => (
                    <button
                      key={c}
                      onClick={() => setCabin(c)}
                      className={`flex-1 rounded-lg py-1.5 text-sm font-medium transition ${
                        cabin === c ? "bg-brand-600 text-white" : "bg-brand-50 text-slate-600"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setTravelersOpen(false)}
                className="mt-4 w-full rounded-lg bg-brand-900 py-2 text-sm font-semibold text-white"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>

      {autoOrigin && tripType !== "multicity" && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
          <MapPin size={12} className="text-brand-600" />
          Departure set to {getAirport(from)?.city ?? from} based on your location — change it above if
          that&apos;s not right.
        </p>
      )}

      <div className="mt-4 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex items-center gap-2 text-sm text-slate-500">
          <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-brand-600" />
          Apply airline promo code
        </label>
        <button
          onClick={handleSearch}
          className="flex items-center justify-center gap-2 rounded-xl bg-accent-500 px-8 py-3 font-heading text-base font-bold text-brand-950 shadow-md shadow-accent-500/30 transition hover:bg-accent-400"
        >
          <Search size={18} />
          Search Flights
        </button>
      </div>

      {dateError && (
        <p className="mt-3 text-sm font-medium text-red-600">Pick a departure date to search flights.</p>
      )}
      {multiError && (
        <p className="mt-3 text-sm font-medium text-red-600">
          Add at least two complete flights — each needs a different origin, destination, and date.
        </p>
      )}

      {recents.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
          <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-400">
            <History size={13} />
            Recent
          </span>
          {recents.map((r) => (
            <button
              key={`${r.from}-${r.to}-${r.depart}-${r.ret ?? ""}-${r.ts}`}
              onClick={() => applyRecent(r)}
              className="group flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
            >
              <span className="font-heading font-bold text-brand-900">
                {r.from} <span className="text-slate-300">→</span> {r.to}
              </span>
              <span className="text-slate-400">
                {fmtDay(r.depart)}
                {r.ret ? `–${fmtDay(r.ret)}` : ""}
              </span>
              {r.adults + r.children + r.infants > 1 && (
                <span className="text-slate-400">· {r.adults + r.children + r.infants} pax</span>
              )}
            </button>
          ))}
          <button
            onClick={() => clearRecentSearches()}
            aria-label="Clear recent searches"
            className="flex items-center gap-1 rounded-full px-2 py-1.5 text-xs font-semibold text-slate-400 transition hover:text-red-600"
          >
            <X size={13} />
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
