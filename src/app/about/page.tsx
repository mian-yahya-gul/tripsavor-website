import type { Metadata } from "next";
import { Compass, HeartHandshake, Target, Users2 } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import CtaBanner from "@/components/CtaBanner";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";

export const metadata: Metadata = {
  title: "About Us — TripSavor",
  description: "Learn about TripSavor' story, mission, and vision for flight booking in Pakistan.",
};

const stats: {
  to?: number;
  decimals?: number;
  suffix?: string;
  text?: string;
  label: string;
}[] = [
  { to: 500, suffix: "K+", label: "Tickets Booked" },
  { to: 120, suffix: "+", label: "Destinations Covered" },
  { text: "24/7", label: "Support Availability" },
  { to: 4.7, decimals: 1, suffix: "/5", label: "Average Customer Rating" },
];

const values = [
  {
    icon: Target,
    title: "Fair Pricing",
    desc: "We show you the real fare up front — no last-minute add-ons at checkout.",
  },
  {
    icon: HeartHandshake,
    title: "People First",
    desc: "Every booking is backed by a support agent you can actually talk to, day or night.",
  },
  {
    icon: Compass,
    title: "Reliability",
    desc: "From payment to e-ticket to check-in, we make sure every step actually works.",
  },
  {
    icon: Users2,
    title: "Community",
    desc: "Built by travelers, for travelers — we understand the routes Pakistanis fly most.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About TripSavor"
        title="Making air travel simple, honest, and affordable"
        description="We started TripSavor to fix a frustrating booking experience — confusing fares, unreachable support, and surprise fees."
      />

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Our Story" title="Why we built TripSavor" />
        <div className="mt-6 space-y-4 text-slate-600">
          <p>
            TripSavor was founded by a small team of travelers who were tired of comparing five
            different booking apps just to find a fair price on a flight home. We set out to
            build one place where the fare shown is the fare you pay, and where a real person is
            always a phone call or WhatsApp message away.
          </p>
          <p>
            Today, TripSavor helps travelers across Pakistan book domestic and international
            flights on the airlines they already trust — with transparent pricing, flexible
            payment options including cash-on-delivery, and a support team that stays with you
            from search to landing.
          </p>
        </div>
      </section>

      <section id="vision" className="scroll-mt-20 bg-brand-50 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Our Vision" title="Where we're headed" />
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="font-heading text-lg font-bold text-brand-950">Mission</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                To make booking a flight from Pakistan as fast, fair, and stress-free as
                possible — for every traveler, on every budget.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="font-heading text-lg font-bold text-brand-950">Vision</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                To become the most trusted name in online flight booking across Pakistan, known
                as much for our people as for our prices.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-heading text-3xl font-extrabold text-brand-700 sm:text-4xl">
                {s.text ? (
                  s.text
                ) : (
                  <CountUp to={s.to ?? 0} decimals={s.decimals} suffix={s.suffix} />
                )}
              </p>
              <p className="mt-1 text-sm text-slate-500">{s.label}</p>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="bg-brand-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="What We Stand For" title="Our values" center />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, desc }, i) => (
              <Reveal
                key={title}
                delay={i * 80}
                className="rounded-2xl bg-white p-6 text-center shadow-sm"
              >
                <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white">
                  <Icon size={20} />
                </span>
                <h3 className="mt-4 font-heading text-base font-bold text-brand-950">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <CtaBanner />
      </section>
    </>
  );
}
