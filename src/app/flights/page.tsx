import Link from "next/link";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import { getAirport } from "@/data/airports";
import { ORIGINS, allRoutes } from "@/data/routes";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Cheap Flights from Pakistan: Karachi, Lahore & Islamabad Routes",
  description:
    "Browse popular international routes from Karachi, Lahore and Islamabad. Compare indicative fares, find the cheapest month and book with 24/7 human support.",
  path: "/flights",
});

export default function FlightsIndexPage() {
  const routes = allRoutes();
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Flights", path: "/flights" }])} />
      <PageHero
        image="/heroes/about.jpg"
        eyebrow="Routes"
        title="Cheap flights from Pakistan"
        description="Pick your departure city and destination to see the cheapest months and compare airlines."
      />
      <div className="mx-auto max-w-5xl space-y-12 px-4 py-14 sm:px-6 lg:px-8">
        {ORIGINS.map((o) => (
          <section key={o} aria-labelledby={`from-${o}`}>
            <h2 id={`from-${o}`} className="font-heading text-2xl font-bold text-brand-950">
              Flights from {getAirport(o)!.city}
            </h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {routes
                .filter((r) => r.origin === o)
                .map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/flights/${r.slug}`}
                      className="block rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-brand-800 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
                    >
                      {getAirport(r.origin)!.city} to {getAirport(r.destination)!.city}
                      <span className="ml-2 text-xs font-normal text-slate-400">
                        {r.origin} → {r.destination}
                      </span>
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
