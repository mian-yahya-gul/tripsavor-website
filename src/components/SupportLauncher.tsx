"use client";

import { useEffect, useRef, useState } from "react";
import { Headset, MessageCircle, Phone, PhoneCall, X } from "lucide-react";
import { siteConfig } from "@/data/site";
import { hasContact, saveContact } from "@/lib/profiles";
import { useContactProfile } from "@/components/useProfiles";
import { buildWhatsAppLink, isAgentsOnline, replyEstimate } from "@/lib/whatsapp";

const telHref = `tel:${siteConfig.phone.replace(/\s/g, "")}`;
const waHref = buildWhatsAppLink("Hi! I'd like some help with a booking.");

export default function SupportLauncher() {
  const saved = useContactProfile();
  const [open, setOpen] = useState(false);
  const [showCallback, setShowCallback] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onPointer = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {open && (
        <div
          role="dialog"
          aria-label="Contact support"
          className="w-[calc(100vw-2.5rem)] max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-brand-950/20"
        >
          <div className="flex items-start justify-between gap-3 bg-brand-950 p-4 text-white">
            <div>
              <p className="font-heading text-sm font-bold">TripSavor Support</p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-brand-100/80">
                <span className={`h-2 w-2 rounded-full ${isAgentsOnline() ? "bg-emerald-400" : "bg-brand-300"}`} />
                {isAgentsOnline() ? "Agents online now" : "Outside chat hours"} · replies in {replyEstimate()}
              </p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close support panel">
              <X size={18} className="text-brand-100/70 transition hover:text-white" />
            </button>
          </div>

          <div className="space-y-2 p-4">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-brand-300 hover:bg-brand-50"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <MessageCircle size={17} />
              </span>
              <span>
                <span className="block text-sm font-semibold text-brand-950">WhatsApp us</span>
                <span className="block text-xs text-slate-500">{siteConfig.whatsapp}</span>
              </span>
            </a>

            <a
              href={telHref}
              className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-brand-300 hover:bg-brand-50"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                <Phone size={17} />
              </span>
              <span>
                <span className="block text-sm font-semibold text-brand-950">Call us</span>
                <span className="block text-xs text-slate-500">{siteConfig.phone}</span>
              </span>
            </a>

            {!showCallback ? (
              <button
                onClick={() => setShowCallback(true)}
                className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 text-left transition hover:border-brand-300 hover:bg-brand-50"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-100 text-accent-600">
                  <PhoneCall size={17} />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-brand-950">
                    Request a callback
                  </span>
                  <span className="block text-xs text-slate-500">We&apos;ll call you shortly</span>
                </span>
              </button>
            ) : sent ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                Got it — an agent will call you within ~15 minutes.
                <button
                  onClick={() => {
                    setSent(false);
                    setShowCallback(false);
                  }}
                  className="mt-1 block text-xs font-semibold text-emerald-700 hover:underline"
                >
                  Done
                </button>
              </div>
            ) : (
              <form
                key={hasContact(saved) ? "saved" : "blank"}
                onSubmit={async (e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  const name = String(fd.get("name") ?? "");
                  const phone = String(fd.get("phone") ?? "");
                  if (fd.get("remember")) {
                    saveContact({ name, email: saved.email, phone });
                  }
                  setSending(true);
                  setError(false);
                  try {
                    const res = await fetch("/api/lead", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        type: "callback",
                        name,
                        email: saved.email,
                        phone,
                      }),
                    });
                    if (!res.ok) throw new Error("Request failed");
                    setSent(true);
                  } catch {
                    setError(true);
                  } finally {
                    setSending(false);
                  }
                }}
                className="space-y-2 rounded-xl border border-slate-200 p-3"
              >
                <input
                  required
                  name="name"
                  defaultValue={saved.name}
                  placeholder="Your name"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
                <input
                  required
                  name="phone"
                  type="tel"
                  defaultValue={saved.phone}
                  placeholder="+92 3XX XXXXXXX"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
                <label className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <input
                    type="checkbox"
                    name="remember"
                    defaultChecked
                    className="h-3.5 w-3.5 rounded border-slate-300 text-brand-600"
                  />
                  Remember me on this device
                </label>
                {error && (
                  <p className="text-[11px] font-medium text-red-600">
                    Couldn&apos;t send that — try WhatsApp or call us instead.
                  </p>
                )}
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full rounded-lg bg-brand-900 py-2 text-sm font-bold text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {sending ? "Sending..." : "Request callback"}
                </button>
              </form>
            )}
          </div>

          <p className="border-t border-slate-100 px-4 py-2.5 text-[11px] text-slate-400">
            {siteConfig.hours}
          </p>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close support" : "Contact support"}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg shadow-brand-950/30 transition hover:bg-brand-700"
      >
        {open ? <X size={22} /> : <Headset size={22} />}
        {!open && (
          <span
            className={`absolute right-0 top-0 h-3.5 w-3.5 rounded-full border-2 border-white ${
              isAgentsOnline() ? "bg-emerald-400" : "bg-brand-300"
            }`}
          />
        )}
      </button>
    </div>
  );
}
