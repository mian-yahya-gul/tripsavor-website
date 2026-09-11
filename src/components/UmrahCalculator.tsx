"use client";

import { type ReactNode, useMemo, useState } from "react";
import {
  Baby,
  Building2,
  Car,
  CheckCircle2,
  ClipboardList,
  DoorOpen,
  EyeOff,
  IdCard,
  Lock,
  Minus,
  Plane,
  Plus,
  User,
  UsersRound,
  Wallet,
  X,
} from "lucide-react";
import {
  SAR_TO_PKR,
  hotelSuggestions,
  roomTypes,
  transportTypes,
  umrahCities,
  visaTypes,
} from "@/data/umrahCalculator";
import { groupRoutes } from "@/data/groupTickets";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { useReplyStatus } from "@/lib/useReplyStatus";

let rowIdCounter = 0;
const nextRowId = () => `row-${++rowIdCounter}`;

type HotelRow = {
  id: string;
  city: string;
  hotel: string;
  rooms: number;
  roomType: string;
  checkIn: string;
  nights: number;
  ratePerNight: number;
};

type TransportRow = {
  id: string;
  type: string;
  qty: number;
  rate: number;
};

const allFlights = groupRoutes.flatMap((route) => route.flights.map((f) => ({ ...f, route })));

function addDays(dateStr: string, days: number) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function pkr(n: number) {
  return `PKR ${Math.round(n).toLocaleString()}`;
}

function StepCard({
  number,
  color,
  title,
  badge,
  icon: Icon,
  children,
}: {
  number: number;
  color: string;
  title: string;
  badge?: string;
  icon: typeof Plane;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-brand-50/80 to-transparent px-5 py-4">
        <div className="flex items-center gap-3">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ backgroundColor: color }}
          >
            {number}
          </span>
          <h3 className="font-heading text-base font-bold text-brand-950">{title}</h3>
          {badge && (
            <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-violet-600">
              {badge}
            </span>
          )}
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
          <Icon size={16} />
        </span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function CounterField({
  icon: Icon,
  label,
  value,
  onChange,
  min = 0,
}: {
  icon: typeof User;
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-brand-50/40 p-4 text-center">
      <span className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-brand-700 text-white">
        <Icon size={16} />
      </span>
      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-300 text-slate-600 hover:border-brand-500 hover:text-brand-700"
        >
          <Minus size={14} />
        </button>
        <span className="w-5 font-heading text-lg font-bold text-brand-950">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(20, value + 1))}
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-300 text-slate-600 hover:border-brand-500 hover:text-brand-700"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-xs">
      <span className="font-semibold uppercase tracking-wide text-slate-400">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "rounded-lg border border-slate-300 px-2.5 py-2 text-sm text-slate-700 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

export default function UmrahCalculator() {
  const replyStatus = useReplyStatus();
  const [visaTypeId, setVisaTypeId] = useState("");
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  const [groupTicketsOpen, setGroupTicketsOpen] = useState(false);
  const [selectedFlightRef, setSelectedFlightRef] = useState("");

  const [roomMode, setRoomMode] = useState<"private" | "sharing">("private");
  const [hotels, setHotels] = useState<HotelRow[]>([
    { id: nextRowId(), city: "", hotel: "", rooms: 1, roomType: "", checkIn: "", nights: 1, ratePerNight: 0 },
  ]);

  const [transportRows, setTransportRows] = useState<TransportRow[]>([]);
  const [requested, setRequested] = useState(false);

  const visaType = visaTypes.find((v) => v.id === visaTypeId);
  const selectedFlight = allFlights.find((f) => f.ref === selectedFlightRef);
  const flightPax = adults + children;

  const visaAdultTotal = (visaType?.sarAdult ?? 0) * adults * SAR_TO_PKR;
  const visaChildTotal = (visaType?.sarChild ?? 0) * children * SAR_TO_PKR;
  const visaInfantTotal = (visaType?.sarInfant ?? 0) * infants * SAR_TO_PKR;
  const visaTotal = visaAdultTotal + visaChildTotal + visaInfantTotal;

  const groupFlightTotal = selectedFlight ? selectedFlight.fare * flightPax : 0;

  const hotelTotal = useMemo(
    () => hotels.reduce((sum, h) => sum + h.rooms * h.nights * h.ratePerNight, 0),
    [hotels]
  );

  const transportTotal = useMemo(
    () => transportRows.reduce((sum, t) => sum + t.qty * t.rate, 0),
    [transportRows]
  );

  const grandTotal = visaTotal + groupFlightTotal + hotelTotal + transportTotal;

  const whatsappLink = useMemo(() => {
    const paxLine = `${adults} adult(s)${children ? `, ${children} child(ren)` : ""}${
      infants ? `, ${infants} infant(s)` : ""
    }`;
    const hotelLines = hotels
      .filter((h) => h.city || h.hotel)
      .map((h) => `- ${h.hotel || "Hotel TBC"} (${h.city || "city TBC"}), ${h.nights} night(s), ${h.rooms} room(s)`);
    const transportLines = transportRows
      .filter((t) => t.qty > 0)
      .map((t) => {
        const label = transportTypes.find((tt) => tt.id === t.type)?.label ?? t.type;
        return `- ${label} × ${t.qty}`;
      });

    const lines = [
      "Hi! I'd like to book an Umrah package with the following estimate:",
      `Visa: ${visaType?.label ?? "Not selected"}`,
      `Travelers: ${paxLine}`,
      selectedFlight ? `Group flight: ${selectedFlight.route.airline} ${selectedFlight.route.route} on ${selectedFlight.date}` : null,
      hotelLines.length ? `Hotels:\n${hotelLines.join("\n")}` : null,
      transportLines.length ? `Transport:\n${transportLines.join("\n")}` : null,
      `Estimated total: ${pkr(grandTotal)}`,
      "Please confirm live rates and next steps.",
    ].filter(Boolean);

    return buildWhatsAppLink(lines.join("\n"));
  }, [adults, children, infants, hotels, transportRows, visaType, selectedFlight, grandTotal]);

  const updateHotel = (id: string, patch: Partial<HotelRow>) =>
    setHotels((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const addHotel = () =>
    setHotels((rows) => [
      ...rows,
      { id: nextRowId(), city: "", hotel: "", rooms: 1, roomType: "", checkIn: "", nights: 1, ratePerNight: 0 },
    ]);
  const removeHotel = (id: string) => setHotels((rows) => rows.filter((r) => r.id !== id));

  const updateTransport = (id: string, patch: Partial<TransportRow>) =>
    setTransportRows((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const addTransport = () =>
    setTransportRows((rows) => [...rows, { id: nextRowId(), type: transportTypes[0].id, qty: 1, rate: 0 }]);
  const removeTransport = (id: string) => setTransportRows((rows) => rows.filter((r) => r.id !== id));

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <StepCard number={1} color="var(--color-brand-700)" title="Visa & Travellers" icon={IdCard}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-slate-200 bg-brand-50/40 p-4">
                <span className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-brand-700 text-white">
                  <IdCard size={16} />
                </span>
                <p className="mb-2 text-center text-xs font-bold uppercase tracking-wide text-slate-500">Visa Type</p>
                <select
                  value={visaTypeId}
                  onChange={(e) => setVisaTypeId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm text-slate-700 outline-none focus:border-brand-500"
                >
                  <option value="">Select Visa Type</option>
                  {visaTypes.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>
              <CounterField icon={User} label="Adults" value={adults} onChange={setAdults} />
              <CounterField icon={UsersRound} label="Children" value={children} onChange={setChildren} />
              <CounterField icon={Baby} label="Infants" value={infants} onChange={setInfants} />
            </div>
          </StepCard>

          <StepCard number={2} color="#7c3aed" title="Group Tickets" badge="Optional" icon={Plane}>
            {!groupTicketsOpen ? (
              <button
                type="button"
                onClick={() => setGroupTicketsOpen(true)}
                className="flex items-center gap-2 text-sm font-bold text-violet-600 hover:text-violet-700"
              >
                <Plus size={16} />
                Add Group Tickets
              </button>
            ) : (
              <div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-sm text-slate-500">
                    Add one of our pre-negotiated group flight fares to this package.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setGroupTicketsOpen(false);
                      setSelectedFlightRef("");
                    }}
                    className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50"
                  >
                    <EyeOff size={13} />
                    Hide
                  </button>
                </div>
                <select
                  value={selectedFlightRef}
                  onChange={(e) => setSelectedFlightRef(e.target.value)}
                  className={`${inputClass} w-full`}
                >
                  <option value="">Select a group flight</option>
                  {allFlights.map((f) => (
                    <option key={f.ref} value={f.ref}>
                      {f.route.airline} · {f.route.route} · {f.date} · PKR {f.fare.toLocaleString()}/person
                    </option>
                  ))}
                </select>
                {selectedFlight && (
                  <p className="mt-3 rounded-lg bg-brand-50 px-3 py-2 text-xs text-brand-800">
                    Applies to {flightPax || 0} traveler(s) (adults + children): PKR{" "}
                    {selectedFlight.fare.toLocaleString()} × {flightPax || 0} ={" "}
                    <strong>{pkr(groupFlightTotal)}</strong>. Infant flight fares are confirmed
                    separately by our team.
                  </p>
                )}
              </div>
            )}
          </StepCard>

          <StepCard number={3} color="#059669" title="Hotel Accommodation" icon={Building2}>
            <div className="mb-4 flex gap-3">
              <button
                type="button"
                onClick={() => setRoomMode("private")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition ${
                  roomMode === "private" ? "bg-brand-900 text-white" : "bg-brand-50 text-slate-500 hover:bg-brand-100"
                }`}
              >
                <DoorOpen size={16} />
                Private Room
              </button>
              <button
                type="button"
                onClick={() => setRoomMode("sharing")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition ${
                  roomMode === "sharing" ? "bg-brand-900 text-white" : "bg-brand-50 text-slate-500 hover:bg-brand-100"
                }`}
              >
                <UsersRound size={16} />
                Sharing Room
              </button>
            </div>

            <div className="space-y-4">
              {hotels.map((h) => {
                const checkOut = h.checkIn ? addDays(h.checkIn, h.nights) : "";
                return (
                  <div key={h.id} className="relative rounded-xl border border-slate-200 p-4">
                    <button
                      type="button"
                      onClick={() => removeHotel(h.id)}
                      className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50"
                      aria-label="Remove hotel"
                    >
                      <X size={13} />
                    </button>
                    <div className="grid grid-cols-2 gap-3 pr-8 sm:grid-cols-4">
                      <Field label="Location">
                        <select
                          value={h.city}
                          onChange={(e) => updateHotel(h.id, { city: e.target.value, hotel: "" })}
                          className={inputClass}
                        >
                          <option value="">City</option>
                          {umrahCities.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Hotel">
                        <select
                          value={h.hotel}
                          onChange={(e) => updateHotel(h.id, { hotel: e.target.value })}
                          disabled={!h.city}
                          className={`${inputClass} disabled:cursor-not-allowed disabled:bg-slate-50`}
                        >
                          <option value="">Select Hotel</option>
                          {(hotelSuggestions[h.city] ?? []).map((name) => (
                            <option key={name} value={name}>
                              {name}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Rooms">
                        <input
                          type="number"
                          min={1}
                          value={h.rooms}
                          onChange={(e) => updateHotel(h.id, { rooms: Math.max(1, Number(e.target.value)) })}
                          className={inputClass}
                        />
                      </Field>
                      <Field label="Room Type">
                        <select
                          value={h.roomType}
                          onChange={(e) => updateHotel(h.id, { roomType: e.target.value })}
                          className={inputClass}
                        >
                          <option value="">Room type</option>
                          {roomTypes.map((rt) => (
                            <option key={rt} value={rt}>
                              {rt}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Check-in">
                        <input
                          type="date"
                          value={h.checkIn}
                          onChange={(e) => updateHotel(h.id, { checkIn: e.target.value })}
                          className={inputClass}
                        />
                      </Field>
                      <Field label="Nights">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => updateHotel(h.id, { nights: Math.max(1, h.nights - 1) })}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-300 text-slate-600"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-4 text-center text-sm font-bold text-brand-900">{h.nights}</span>
                          <button
                            type="button"
                            onClick={() => updateHotel(h.id, { nights: h.nights + 1 })}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-300 text-slate-600"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </Field>
                      <Field label="Check-out">
                        <input
                          type="text"
                          readOnly
                          value={checkOut}
                          placeholder="—"
                          className={`${inputClass} bg-brand-50 text-brand-700`}
                        />
                      </Field>
                      <Field label="Rate / Night (PKR)">
                        <input
                          type="number"
                          min={0}
                          value={h.ratePerNight || ""}
                          placeholder="0"
                          onChange={(e) => updateHotel(h.id, { ratePerNight: Number(e.target.value) || 0 })}
                          className={inputClass}
                        />
                      </Field>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={addHotel}
              className="mt-4 flex items-center gap-2 rounded-xl border border-dashed border-emerald-300 px-4 py-2.5 text-sm font-bold text-emerald-600 hover:bg-emerald-50"
            >
              <Plus size={15} />
              Add Hotel
            </button>
          </StepCard>

          <StepCard number={4} color="#d97706" title="Private Transport" icon={Car}>
            {transportRows.length > 0 && (
              <div className="mb-4 space-y-3">
                {transportRows.map((t) => (
                  <div key={t.id} className="relative grid grid-cols-2 gap-3 rounded-xl border border-slate-200 p-4 pr-10 sm:grid-cols-3">
                    <button
                      type="button"
                      onClick={() => removeTransport(t.id)}
                      className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50"
                      aria-label="Remove transport"
                    >
                      <X size={13} />
                    </button>
                    <Field label="Service">
                      <select
                        value={t.type}
                        onChange={(e) => updateTransport(t.id, { type: e.target.value })}
                        className={inputClass}
                      >
                        {transportTypes.map((tt) => (
                          <option key={tt.id} value={tt.id}>
                            {tt.label}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Trips / Days">
                      <input
                        type="number"
                        min={1}
                        value={t.qty}
                        onChange={(e) => updateTransport(t.id, { qty: Math.max(1, Number(e.target.value)) })}
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Rate (PKR)">
                      <input
                        type="number"
                        min={0}
                        value={t.rate || ""}
                        placeholder="0"
                        onChange={(e) => updateTransport(t.id, { rate: Number(e.target.value) || 0 })}
                        className={inputClass}
                      />
                    </Field>
                  </div>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={addTransport}
              className="flex items-center gap-2 rounded-xl border border-dashed border-amber-300 px-4 py-2.5 text-sm font-bold text-amber-600 hover:bg-amber-50"
            >
              <Plus size={15} />
              Add Transport
            </button>
          </StepCard>

          <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row">
            <span className="flex items-center gap-2 text-sm text-slate-500">
              <Lock size={15} className="text-brand-600" />
              Secure booking — no payment is taken on this page
            </span>
            <div className="flex w-full flex-col items-center gap-1 sm:w-auto sm:items-end">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setRequested(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-900 px-6 py-3 font-heading text-sm font-bold text-white transition hover:bg-brand-800 sm:w-auto"
              >
                Continue to Booking
                <span aria-hidden>→</span>
              </a>
              {replyStatus && <p className="text-[11px] text-slate-400">Replies in {replyStatus.estimate}</p>}
            </div>
          </div>

          {requested && (
            <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-emerald-600" />
              <div>
                <p className="font-heading text-sm font-bold text-emerald-900">Package summary sent</p>
                <p className="mt-1 text-sm text-emerald-800">
                  We opened WhatsApp with your package details prefilled — send the message and
                  our Umrah desk will confirm live hotel and flight rates. Total estimate:{" "}
                  {pkr(grandTotal)}.
                </p>
              </div>
            </div>
          )}
        </div>

        <aside className="h-fit lg:sticky lg:top-24">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center gap-3 bg-gradient-to-r from-brand-900 to-brand-700 px-5 py-4 text-white">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
                <ClipboardList size={17} />
              </span>
              <div>
                <p className="font-heading text-base font-bold">Price Summary</p>
                <p className="text-xs text-brand-100/80">Updates as you configure</p>
              </div>
            </div>

            <div className="space-y-4 p-5">
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-400">
                  <IdCard size={13} />
                  Visa Charges (converted to PKR)
                </p>
                <div className="space-y-1.5 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Adults</span>
                    <span>
                      {adults} × SAR {(visaType?.sarAdult ?? 0).toFixed(2)} = {pkr(visaAdultTotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Children</span>
                    <span>
                      {children} × SAR {(visaType?.sarChild ?? 0).toFixed(2)} = {pkr(visaChildTotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Infants</span>
                    <span>
                      {infants} × SAR {(visaType?.sarInfant ?? 0).toFixed(2)} = {pkr(visaInfantTotal)}
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between rounded-lg bg-brand-50 px-3 py-2 text-sm font-bold text-brand-900">
                  <span>Visa Total</span>
                  <span>{pkr(visaTotal)}</span>
                </div>
              </div>

              {groupTicketsOpen && selectedFlight && (
                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-400">
                    <Plane size={13} />
                    Group Flight
                  </p>
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>{flightPax} traveler(s)</span>
                    <span>× {pkr(selectedFlight.fare)}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between rounded-lg bg-brand-50 px-3 py-2 text-sm font-bold text-brand-900">
                    <span>Flight Total</span>
                    <span>{pkr(groupFlightTotal)}</span>
                  </div>
                </div>
              )}

              <div className="rounded-xl border border-slate-200 p-4">
                <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-400">
                  <Building2 size={13} />
                  Hotel Accommodation
                </p>
                {hotels.every((h) => !h.ratePerNight) ? (
                  <p className="text-sm italic text-slate-400">No hotel rates entered yet</p>
                ) : (
                  <div className="space-y-1.5 text-sm text-slate-600">
                    {hotels
                      .filter((h) => h.ratePerNight > 0)
                      .map((h) => (
                        <div key={h.id} className="flex items-center justify-between gap-2">
                          <span className="truncate">
                            {h.hotel || h.city || "Hotel"} · {h.rooms} rm × {h.nights}n
                          </span>
                          <span className="shrink-0">{pkr(h.rooms * h.nights * h.ratePerNight)}</span>
                        </div>
                      ))}
                  </div>
                )}
                <div className="mt-3 flex items-center justify-between rounded-lg bg-brand-50 px-3 py-2 text-sm font-bold text-brand-900">
                  <span>Hotel Total</span>
                  <span>{pkr(hotelTotal)}</span>
                </div>
              </div>

              {transportRows.length > 0 && (
                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-400">
                    <Car size={13} />
                    Private Transport
                  </p>
                  <div className="space-y-1.5 text-sm text-slate-600">
                    {transportRows.map((t) => (
                      <div key={t.id} className="flex items-center justify-between gap-2">
                        <span className="truncate">
                          {transportTypes.find((tt) => tt.id === t.type)?.label ?? "Transport"} · ×{t.qty}
                        </span>
                        <span className="shrink-0">{pkr(t.qty * t.rate)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-between rounded-lg bg-brand-50 px-3 py-2 text-sm font-bold text-brand-900">
                    <span>Transport Total</span>
                    <span>{pkr(transportTotal)}</span>
                  </div>
                </div>
              )}

              <div className="rounded-xl bg-brand-950 p-5 text-center text-white">
                <p className="mb-1 flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wide text-accent-400">
                  <Wallet size={13} />
                  Total Package Cost
                </p>
                <p className="font-heading text-3xl font-extrabold">{pkr(grandTotal)}</p>
                <p className="mt-1 text-xs text-brand-100/70">
                  All amounts in PKR at SAR rate: {SAR_TO_PKR.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
