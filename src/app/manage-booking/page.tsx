"use client";

import { useState } from "react";
import { AlertCircle, FileSearch, Phone, Ticket } from "lucide-react";
import PageHero from "@/components/PageHero";
import { siteConfig } from "@/data/site";

export default function ManageBookingPage() {
  const [searched, setSearched] = useState(false);
  const [reference, setReference] = useState("");
  const [lastName, setLastName] = useState("");

  return (
    <>
      <PageHero
        eyebrow="Manage Booking"
        title="Retrieve your itinerary"
        description="Enter your booking reference and last name exactly as they appear on your e-ticket."
      />

      <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSearched(true);
          }}
          className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-semibold text-slate-700">Booking Reference (PNR)</span>
              <input
                required
                value={reference}
                onChange={(e) => setReference(e.target.value.toUpperCase())}
                placeholder="e.g. TT4X92K"
                className="rounded-lg border border-slate-300 px-3 py-2.5 uppercase outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-semibold text-slate-700">Passenger Last Name</span>
              <input
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="As shown on ticket"
                className="rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </label>
          </div>
          <button
            type="submit"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 font-heading text-sm font-bold text-white shadow-md transition hover:bg-brand-700"
          >
            <FileSearch size={18} />
            Retrieve Booking
          </button>
        </form>

        {searched && (
          <div className="mt-6 rounded-2xl border border-accent-400 bg-accent-100 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="mt-0.5 shrink-0 text-accent-600" />
              <div>
                <h3 className="font-heading text-base font-bold text-brand-950">
                  We couldn&apos;t find that booking
                </h3>
                <p className="mt-1 text-sm text-slate-700">
                  Double-check your reference <strong>{reference || "—"}</strong> and last name
                  for typos. If the problem continues, our support team can look it up directly.
                </p>
                <a
                  href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                  className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:underline"
                >
                  <Phone size={14} />
                  Call {siteConfig.phone}
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10 flex items-start gap-3 rounded-2xl bg-brand-50 p-5 text-sm text-slate-600">
          <Ticket size={18} className="mt-0.5 shrink-0 text-brand-600" />
          <p>
            Your booking reference is a 6-8 character code sent to you by email and SMS right
            after payment is confirmed. It also appears at the top of your e-ticket PDF.
          </p>
        </div>
      </section>
    </>
  );
}
