import Link from "next/link";
import { ArrowRight, TrendingDown } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import Price from "@/components/Price";
import { getDeals } from "@/lib/deals";
import { buildSearchQuery } from "@/lib/searchParams";

export default function DealFeed() {
  const deals = getDeals();
  if (deals.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Fare Drops"
        title="Deals worth booking now"
        description="Routes where our estimated fare is running well below its typical level. Refreshed regularly."
      />

      <Reveal className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {deals.map((d) => (
          <Link
            key={`${d.origin}-${d.destination}`}
            href={`/search?${buildSearchQuery({
              from: d.origin,
              to: d.destination,
              depart: d.date,
              ret: d.returnDate,
              tripType: "roundtrip",
              cabin: "Economy",
              adults: 1,
              children: 0,
              infants: 0,
            })}`}
            className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-950/10"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="font-heading text-lg font-bold text-brand-950">
                {d.originCity} <span className="text-slate-300">→</span> {d.destCity}
              </span>
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                <TrendingDown size={12} />
                {d.dropPct}% off
              </span>
            </div>

            <p className="mt-3 flex items-baseline gap-2">
              <Price
                pkr={d.price}
                className="font-heading text-2xl font-extrabold text-brand-950"
              />
              <Price pkr={d.typical} className="text-sm text-slate-400 line-through" />
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Round trip · cheapest around {d.dateLabel}
            </p>

            <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand-700 transition group-hover:text-brand-900">
              See flights
              <ArrowRight size={14} />
            </span>
          </Link>
        ))}
      </Reveal>
    </section>
  );
}
