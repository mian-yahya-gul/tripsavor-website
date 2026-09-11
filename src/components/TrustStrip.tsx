import { BadgeCheck, Clock, ShieldCheck, Wallet } from "lucide-react";

const items = [
  { icon: Clock, title: "24/7 Live Support", desc: "Call or WhatsApp anytime" },
  { icon: BadgeCheck, title: "Best Fare Guarantee", desc: "Transparent pricing, no surprises" },
  { icon: ShieldCheck, title: "Secure Checkout", desc: "Encrypted payment processing" },
  { icon: Wallet, title: "Flexible Payments", desc: "Cards, bank transfer & COD" },
];

export default function TrustStrip() {
  return (
    <div className="mx-auto -mt-8 grid max-w-5xl grid-cols-2 gap-3 px-4 sm:mt-6 sm:grid-cols-4 sm:gap-4 sm:px-6">
      {items.map(({ icon: Icon, title, desc }) => (
        <div
          key={title}
          className="flex flex-col items-center gap-1.5 rounded-xl bg-white px-3 py-4 text-center shadow-sm shadow-brand-950/5 sm:flex-row sm:items-start sm:gap-3 sm:text-left"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
            <Icon size={18} />
          </span>
          <div>
            <p className="text-sm font-semibold text-brand-950">{title}</p>
            <p className="text-xs text-slate-500">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
