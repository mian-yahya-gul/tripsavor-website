"use client";

import { MessageCircle, Phone } from "lucide-react";
import { siteConfig } from "@/data/site";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { useReplyStatus } from "@/lib/useReplyStatus";

export default function CtaBanner() {
  const waLink = buildWhatsAppLink("Hi! I'm looking for help booking a flight — can you assist?");
  const status = useReplyStatus();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-brand-900 px-6 py-12 text-center sm:px-16">
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-600/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-accent-500/20 blur-3xl" />
      <div className="relative">
        <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
          Ready to book your next flight?
        </h2>
        <p className="mx-auto mt-2 flex max-w-lg items-center justify-center gap-1.5 text-sm text-brand-100/80">
          {status ? (
            <>
              <span className={`h-1.5 w-1.5 rounded-full ${status.online ? "bg-emerald-400" : "bg-brand-300"}`} />
              {status.online ? "Our travel agents are online now" : "Agents are offline right now"} · replies in{" "}
              {status.estimate}
            </>
          ) : (
            "Our travel agents are ready to find you the best fare."
          )}
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
            className="flex items-center gap-2 rounded-xl bg-accent-500 px-6 py-3 font-heading text-sm font-bold text-brand-950 shadow-md transition hover:bg-accent-400"
          >
            <Phone size={16} />
            Call {siteConfig.phone}
          </a>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3 font-heading text-sm font-bold text-white transition hover:bg-white/10"
          >
            <MessageCircle size={16} />
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
