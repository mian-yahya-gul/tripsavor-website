"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { clearContact, hasContact, saveContact } from "@/lib/profiles";
import { useContactProfile } from "@/components/useProfiles";

export default function ContactForm() {
  const saved = useContactProfile();
  const prefilled = hasContact(saved);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <CheckCircle2 size={40} className="text-brand-600" />
        <h3 className="font-heading text-lg font-bold text-brand-950">Message received</h3>
        <p className="max-w-sm text-sm text-slate-600">
          Thanks for reaching out — a TripSavor agent will get back to you shortly, usually
          within the hour.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-2 text-sm font-semibold text-brand-700 hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      key={prefilled ? "saved" : "blank"}
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        if (fd.get("remember")) {
          saveContact({
            name: String(fd.get("name") ?? ""),
            email: String(fd.get("email") ?? ""),
            phone: String(fd.get("phone") ?? ""),
          });
        }
        setSubmitted(true);
      }}
      className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:grid-cols-2 sm:p-8"
    >
      {prefilled && (
        <p className="flex items-center justify-between gap-2 text-xs text-slate-500 sm:col-span-2">
          <span>Prefilled from your saved details.</span>
          <button
            type="button"
            onClick={() => clearContact()}
            className="font-semibold text-brand-700 hover:underline"
          >
            Clear saved details
          </button>
        </p>
      )}

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-semibold text-slate-700">Full Name</span>
        <input
          required
          name="name"
          type="text"
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
        <span className="font-semibold text-slate-700">Subject</span>
        <select className="rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100">
          <option>New Booking Query</option>
          <option>Existing Booking Support</option>
          <option>Refunds &amp; Cancellations</option>
          <option>Corporate Travel</option>
          <option>Other</option>
        </select>
      </label>
      <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
        <span className="font-semibold text-slate-700">Message</span>
        <textarea
          required
          rows={5}
          placeholder="Tell us how we can help..."
          className="resize-none rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
      </label>

      <label className="flex items-center gap-2 text-sm text-slate-500 sm:col-span-2">
        <input
          type="checkbox"
          name="remember"
          defaultChecked={prefilled}
          className="h-4 w-4 rounded border-slate-300 text-brand-600"
        />
        Save my name, email &amp; phone on this device for next time
      </label>

      <button
        type="submit"
        className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3 font-heading text-sm font-bold text-white shadow-md transition hover:bg-brand-700 sm:col-span-2"
      >
        <Send size={16} />
        Send Message
      </button>
    </form>
  );
}
