"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";
import AirportField from "@/components/AirportField";
import { clearContact, hasContact, saveContact } from "@/lib/profiles";
import { useContactProfile } from "@/components/useProfiles";
import { siteConfig } from "@/data/site";

export default function GroupTicketForm() {
  const saved = useContactProfile();
  const prefilled = hasContact(saved);
  const [tripType, setTripType] = useState<"oneway" | "roundtrip">("roundtrip");
  const [from, setFrom] = useState("KHI");
  const [to, setTo] = useState("JED");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <CheckCircle2 size={40} className="text-brand-600" />
        <h3 className="font-heading text-lg font-bold text-brand-950">Request received</h3>
        <p className="max-w-sm text-sm text-slate-600">
          Thanks for reaching out — our dedicated Group Travel Desk will review your request and
          call you back with fare options within 24 hours.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-2 text-sm font-semibold text-brand-700 hover:underline"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form
      key={prefilled ? "saved" : "blank"}
      onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const name = String(fd.get("name") ?? "");
        const email = String(fd.get("email") ?? "");
        const phone = String(fd.get("phone") ?? "");
        if (fd.get("remember")) {
          saveContact({ name, email, phone });
        }
        setSending(true);
        setError(false);
        try {
          const res = await fetch("/api/lead", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "group-tickets",
              name,
              email,
              phone,
              details: {
                "Group type": String(fd.get("groupType") ?? ""),
                Passengers: String(fd.get("passengers") ?? ""),
                Route: `${from} → ${to}`,
                "Trip type": tripType,
                Departure: String(fd.get("departDate") ?? ""),
                Return: String(fd.get("returnDate") ?? ""),
                Organization: String(fd.get("organization") ?? ""),
              },
              message: String(fd.get("requirements") ?? ""),
            }),
          });
          if (!res.ok) throw new Error("Request failed");
          setSubmitted(true);
        } catch {
          setError(true);
        } finally {
          setSending(false);
        }
      }}
      className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"
    >
      <div className="mb-5 flex gap-1 rounded-lg bg-brand-50 p-1 text-sm font-semibold">
        {(
          [
            ["roundtrip", "Round Trip"],
            ["oneway", "One Way"],
          ] as ["roundtrip" | "oneway", string][]
        ).map(([value, label]) => (
          <button
            type="button"
            key={value}
            onClick={() => setTripType(value)}
            className={`rounded-md px-4 py-1.5 transition ${
              tripType === value ? "bg-brand-600 text-white shadow-sm" : "text-slate-600 hover:text-brand-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-semibold text-slate-700">Group Type</span>
          <select
            name="groupType"
            className="rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          >
            <option>Umrah / Ziyarat Group</option>
            <option>Corporate Travel</option>
            <option>Wedding & Family Group</option>
            <option>Educational / Sports Tour</option>
            <option>Leisure / Tour Group</option>
            <option>Other</option>
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-semibold text-slate-700">Number of Passengers</span>
          <input
            required
            name="passengers"
            type="number"
            min={10}
            defaultValue={10}
            placeholder="Minimum 10"
            className="rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </label>

        <AirportField
          label="From"
          value={from}
          onChange={setFrom}
          exclude={to}
          className="rounded-lg border border-slate-300 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100"
        />
        <AirportField
          label="To"
          value={to}
          onChange={setTo}
          exclude={from}
          className="rounded-lg border border-slate-300 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100"
        />

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-semibold text-slate-700">Departure Date</span>
          <input
            required
            name="departDate"
            type="date"
            className="rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </label>
        <label className={`flex flex-col gap-1.5 text-sm ${tripType === "oneway" ? "opacity-40" : ""}`}>
          <span className="font-semibold text-slate-700">Return Date</span>
          <input
            disabled={tripType === "oneway"}
            name="returnDate"
            type="date"
            className="rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-slate-50"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
          <span className="font-semibold text-slate-700">Group / Organization Name</span>
          <input
            name="organization"
            placeholder="e.g. Al-Noor Travel Group, ABC Corporation"
            className="rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </label>

        {prefilled && (
          <p className="flex items-center justify-between gap-2 text-xs text-slate-500 sm:col-span-2">
            <span>Contact details prefilled from this device.</span>
            <button
              type="button"
              onClick={() => clearContact()}
              className="font-semibold text-brand-700 hover:underline"
            >
              Clear
            </button>
          </p>
        )}

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-semibold text-slate-700">Contact Name</span>
          <input
            required
            name="name"
            defaultValue={saved.name}
            placeholder="Your name"
            className="rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-semibold text-slate-700">Phone Number</span>
          <input
            required
            name="phone"
            type="tel"
            defaultValue={saved.phone}
            placeholder="+92 3XX XXXXXXX"
            className="rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
          <span className="font-semibold text-slate-700">Email Address</span>
          <input
            required
            name="email"
            type="email"
            defaultValue={saved.email}
            placeholder="you@example.com"
            className="rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
          <span className="font-semibold text-slate-700">Additional Requirements</span>
          <textarea
            name="requirements"
            rows={4}
            placeholder="Seating together, special meals, group check-in, hotel/visa add-ons, etc."
            className="resize-none rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </label>
      </div>

      <label className="mt-4 flex items-center gap-2 text-sm text-slate-500">
        <input
          type="checkbox"
          name="remember"
          defaultChecked={prefilled}
          className="h-4 w-4 rounded border-slate-300 text-brand-600"
        />
        Save my contact details on this device for next time
      </label>

      {error && (
        <p className="mt-4 flex items-center gap-2 text-sm font-medium text-red-600">
          <AlertCircle size={15} />
          Something went wrong sending your request — please try again, or reach us directly at{" "}
          {siteConfig.phone}.
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 font-heading text-sm font-bold text-white shadow-md transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Send size={16} />
        {sending ? "Sending..." : "Request Group Fare"}
      </button>
      <p className="mt-3 text-center text-xs text-slate-400">
        Group fares apply to bookings of 10 or more passengers traveling on the same route and
        dates. A member of our team will confirm final pricing before you pay.
      </p>
    </form>
  );
}
