import { MessageCircle, Phone } from "lucide-react";
import { siteConfig } from "@/data/site";

export default function CtaBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-brand-900 px-6 py-12 text-center sm:px-16">
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-600/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-accent-500/20 blur-3xl" />
      <div className="relative">
        <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
          Ready to book your next flight?
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-brand-100/80">
          Our travel agents are online right now and ready to find you the best fare.
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
            href={`https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, "")}`}
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
