import { CreditCard, HeadphonesIcon, RefreshCcw, ShieldCheck, TicketCheck, TrendingDown } from "lucide-react";

const features = [
  {
    icon: TrendingDown,
    title: "Lowest Fare Search",
    desc: "We compare dozens of routings across leading airlines so you're never overpaying for the same seat.",
  },
  {
    icon: HeadphonesIcon,
    title: "Real Human Support",
    desc: "Talk to an actual travel agent by phone or WhatsApp — no bots, no endless hold music.",
  },
  {
    icon: RefreshCcw,
    title: "Hassle-Free Rebooking",
    desc: "Flight changed or delayed? We handle the airline back-and-forth so you don't have to.",
  },
  {
    icon: CreditCard,
    title: "Flexible Payments",
    desc: "Pay by card, bank transfer, or cash-on-delivery through our rider network in major cities.",
  },
  {
    icon: TicketCheck,
    title: "Instant E-Tickets",
    desc: "Confirmed bookings land in your inbox within minutes, ready to check in with the airline.",
  },
  {
    icon: ShieldCheck,
    title: "Secure by Design",
    desc: "Encrypted checkout and strict data-handling practices keep your information protected.",
  },
];

export default function WhyChooseUs() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {features.map(({ icon: Icon, title, desc }) => (
        <div key={title} className="rounded-2xl border border-slate-200 p-6 transition hover:border-brand-200 hover:bg-brand-50/50">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white">
            <Icon size={20} />
          </span>
          <h3 className="mt-4 font-heading text-lg font-bold text-brand-950">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{desc}</p>
        </div>
      ))}
    </div>
  );
}
