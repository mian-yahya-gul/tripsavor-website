import { CreditCard, PlaneTakeoff, Search } from "lucide-react";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Search Your Route",
    desc: "Enter your origin, destination, dates, and number of travelers in the search widget above.",
  },
  {
    icon: CreditCard,
    step: "02",
    title: "Pick & Pay",
    desc: "Compare fares, choose the flight that fits your budget, and pay by card, bank transfer, or COD.",
  },
  {
    icon: PlaneTakeoff,
    step: "03",
    title: "Get Your E-Ticket",
    desc: "Your confirmed ticket lands in your inbox in minutes — ready for check-in with the airline.",
  },
];

export default function HowItWorks() {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
      {steps.map(({ icon: Icon, step, title, desc }, i) => (
        <div key={step} className="relative text-center">
          <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg shadow-brand-600/30">
            <Icon size={24} />
            <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent-500 text-[11px] font-bold text-brand-950">
              {step}
            </span>
          </div>
          <h3 className="mt-4 font-heading text-lg font-bold text-brand-950">{title}</h3>
          <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-slate-600">{desc}</p>
          {i < steps.length - 1 && (
            <div className="absolute right-[-1rem] top-8 hidden h-px w-8 border-t-2 border-dashed border-brand-200 sm:block" />
          )}
        </div>
      ))}
    </div>
  );
}
