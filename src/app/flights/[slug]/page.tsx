import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, MessageCircle, PiggyBank } from "lucide-react";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import FaqAccordion from "@/components/FaqAccordion";
import CtaBanner from "@/components/CtaBanner";
import Price from "@/components/Price";
import { CITY_PHOTOS } from "@/data/cityPhotos";
import { getAirport } from "@/data/airports";
import { airlinesWeCompare } from "@/data/site";
import { allRoutes, parseRoute } from "@/data/routes";
import type { Faq } from "@/data/faqs";
import { estimateDailyFare } from "@/lib/fareCalendar";
import { formatMoney } from "@/lib/currency";
import { abs, breadcrumbLd, faqLd, pageMetadata } from "@/lib/seo";
import { buildSearchQuery } from "@/lib/searchParams";

// Fares are estimates that depend on the current month, so refresh daily.
export const revalidate = 86400;

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return allRoutes().map((r) => ({ slug: r.slug }));
}

function monthRows(origin: string, destination: string) {
  const now = new Date();
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 15);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-15`;
    return {
      iso,
      label: d.toLocaleDateString("en-GB", { month: "long", year: "numeric" }),
      oneway: estimateDailyFare({ origin, destination, date: iso, cabin: "Economy", tripType: "oneway" }),
      round: estimateDailyFare({ origin, destination, date: iso, cabin: "Economy", tripType: "roundtrip" }),
    };
  });
}

function build(origin: string, destination: string) {
  const o = getAirport(origin)!;
  const d = getAirport(destination)!;
  const rows = monthRows(origin, destination);
  const cheapest = rows.reduce((a, b) => (b.round < a.round ? b : a));
  const priciest = rows.reduce((a, b) => (b.round > a.round ? b : a));
  const fromOneWay = Math.min(...rows.map((r) => r.oneway));
  const fromRound = cheapest.round;
  const money = (n: number) => formatMoney(n, "PKR");

  const answer =
    `Flights from ${o.city} (${o.code}) to ${d.city} (${d.code}) start from about ${money(fromOneWay)} one way ` +
    `or ${money(fromRound)} return in economy, based on TripSavor's indicative fares. ` +
    `${cheapest.label} is currently the cheapest month to fly; final prices depend on the airline, date and seat availability.`;

  const faqs: Faq[] = [
    {
      question: `How much is a flight from ${o.city} to ${d.city}?`,
      answer: `Indicative economy fares from ${o.city} to ${d.city} start from around ${money(fromOneWay)} one way and ${money(fromRound)} return. Live prices change daily, so search your exact dates on TripSavor or message our team for a confirmed quote.`,
    },
    {
      question: `When is the cheapest time to fly from ${o.city} to ${d.city}?`,
      answer: `Our fare estimates are lowest around ${cheapest.label} and highest around ${priciest.label}. Midweek departures (Tuesday and Wednesday) are usually cheaper than Friday to Sunday.`,
    },
    {
      question: `Which airlines can I compare for ${o.city} to ${d.city}?`,
      answer: `TripSavor compares fares across ${airlinesWeCompare.slice(0, 8).join(", ")} and more. Which carriers operate your exact route and date is shown in the live search results.`,
    },
    {
      question: `Can I book ${o.city} to ${d.city} flights through WhatsApp or by phone?`,
      answer: `Yes. Pick a flight on TripSavor, tap Confirm on WhatsApp, and a real travel agent confirms the live fare with you before any payment. You can also call us directly.`,
    },
    {
      question: `What payment methods can I use?`,
      answer: `We accept debit and credit cards, bank transfer and cash on delivery in select cities. Your booking is confirmed once payment is received and your e-ticket is emailed to you.`,
    },
  ];

  return { o, d, rows, cheapest, fromOneWay, fromRound, answer, faqs };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const r = parseRoute(slug);
  if (!r) return {};
  const { o, d, fromRound } = build(r.origin, r.destination);
  return pageMetadata({
    title: `Cheap Flights from ${o.city} to ${d.city} (${o.code} → ${d.code})`,
    description: `Compare flights from ${o.city} to ${d.city} from about ${formatMoney(fromRound, "PKR")} return. See the cheapest months, compare airlines and book with 24/7 human support.`,
    path: `/flights/${slug}`,
    image: CITY_PHOTOS[r.destination],
  });
}

export default async function RoutePage({ params }: Params) {
  const { slug } = await params;
  const r = parseRoute(slug);
  if (!r) notFound();
  const { o, d, rows, cheapest, fromOneWay, fromRound, answer, faqs } = build(r.origin, r.destination);

  const searchHref = (iso: string, round: boolean) =>
    `/search?${buildSearchQuery({
      from: r.origin,
      to: r.destination,
      depart: iso,
      ret: round ? `${iso.slice(0, 8)}22` : undefined,
      tripType: round ? "roundtrip" : "oneway",
      cabin: "Economy",
      adults: 1,
      children: 0,
      infants: 0,
    })}`;

  const related = allRoutes()
    .filter((x) => x.slug !== slug && (x.origin === r.origin || x.destination === r.destination))
    .slice(0, 8);

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Flights", path: "/flights" },
          { name: `${o.city} to ${d.city}`, path: `/flights/${slug}` },
        ])}
      />
      <JsonLd data={faqLd(faqs)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: `Flights from ${o.city} to ${d.city}`,
          url: abs(`/flights/${slug}`),
          description: answer,
          about: { "@type": "Trip", name: `${o.city} to ${d.city}` },
          isPartOf: { "@type": "WebSite", name: "TripSavor", url: abs() },
        }}
      />

      <PageHero
        image={CITY_PHOTOS[r.destination]}
        eyebrow={`${o.code} → ${d.code}`}
        title={`Cheap flights from ${o.city} to ${d.city}`}
        description={`Compare fares, find the cheapest month and book with a real travel agent on your side.`}
      />

      <article className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-slate-500">
          <Link href="/" className="hover:text-brand-700">Home</Link> /{" "}
          <Link href="/flights" className="hover:text-brand-700">Flights</Link> /{" "}
          <span className="text-slate-700">{o.city} to {d.city}</span>
        </nav>

        <section aria-labelledby="quick-answer" className="rounded-2xl border border-brand-100 bg-brand-50/60 p-6">
          <h2 id="quick-answer" className="font-heading text-lg font-bold text-brand-950">
            How much is a flight from {o.city} to {d.city}?
          </h2>
          <p className="mt-2 leading-relaxed text-slate-700">{answer}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={searchHref(cheapest.iso, true)}
              className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-2.5 font-heading text-sm font-bold text-brand-950 transition hover:bg-accent-400"
            >
              Search {o.code} → {d.code} <ArrowRight size={15} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-brand-200 px-5 py-2.5 font-heading text-sm font-bold text-brand-800 transition hover:bg-white"
            >
              <MessageCircle size={15} /> Ask an agent
            </Link>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="cheapest-month">
          <h2 id="cheapest-month" className="flex items-center gap-2 font-heading text-2xl font-bold text-brand-950">
            <CalendarDays size={22} className="text-brand-600" /> Cheapest months to fly {o.city} to {d.city}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Indicative economy fares for a mid-month departure over the next 12 months. Tap a month to run a live
            search.
          </p>
          <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full min-w-[420px] text-sm">
              <caption className="sr-only">
                Estimated {o.city} to {d.city} fares by month
              </caption>
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th scope="col" className="px-4 py-3">Month</th>
                  <th scope="col" className="px-4 py-3">One way from</th>
                  <th scope="col" className="px-4 py-3">Return from</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((row) => (
                  <tr key={row.iso} className={row.iso === cheapest.iso ? "bg-emerald-50/60" : ""}>
                    <th scope="row" className="px-4 py-3 text-left font-semibold text-brand-950">
                      <Link href={searchHref(row.iso, true)} className="hover:text-brand-700">
                        {row.label}
                      </Link>
                      {row.iso === cheapest.iso && (
                        <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                          Cheapest
                        </span>
                      )}
                    </th>
                    <td className="px-4 py-3"><Price pkr={row.oneway} /></td>
                    <td className="px-4 py-3 font-semibold"><Price pkr={row.round} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">
            Estimates only, not live airline prices. Final fares are confirmed by our team before you pay.
          </p>
        </section>

        <section className="mt-12" aria-labelledby="why-book">
          <h2 id="why-book" className="flex items-center gap-2 font-heading text-2xl font-bold text-brand-950">
            <PiggyBank size={22} className="text-brand-600" /> Why book {o.city} to {d.city} with TripSavor
          </h2>
          <ul className="mt-4 space-y-2 text-slate-700">
            <li>• We compare fares across leading airlines, including {airlinesWeCompare.slice(0, 5).join(", ")}.</li>
            <li>• Real human support by phone and WhatsApp, 24/7. Prices start from {formatMoney(fromOneWay, "PKR")} one way.</li>
            <li>• Pay by card, bank transfer or cash on delivery. No hidden fees added after you confirm.</li>
            <li>• Group travelling? See our <Link href="/group-tickets" className="font-semibold text-brand-700 underline">group ticket fares</Link>.</li>
          </ul>
        </section>

        <section className="mt-12" aria-labelledby="route-faqs">
          <h2 id="route-faqs" className="font-heading text-2xl font-bold text-brand-950">
            {o.city} to {d.city} flights: common questions
          </h2>
          <div className="mt-5">
            <FaqAccordion items={faqs} />
          </div>
        </section>

        <section className="mt-12" aria-labelledby="related">
          <h2 id="related" className="font-heading text-xl font-bold text-brand-950">
            Related routes
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {related.map((x) => (
              <li key={x.slug}>
                <Link
                  href={`/flights/${x.slug}`}
                  className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-brand-800 transition hover:border-brand-300 hover:bg-brand-50"
                >
                  {getAirport(x.origin)!.city} to {getAirport(x.destination)!.city}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </article>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <CtaBanner />
      </section>
    </>
  );
}
