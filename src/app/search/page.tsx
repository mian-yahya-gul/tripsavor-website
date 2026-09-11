import Link from "next/link";
import { ArrowLeftRight, Pencil } from "lucide-react";
import PageHero from "@/components/PageHero";
import FlightResults from "@/components/FlightResults";
import FlightResultsBrowser from "@/components/FlightResultsBrowser";
import FlexDateStrip from "@/components/FlexDateStrip";
import { airports } from "@/data/airports";
import { getFareProvider } from "@/lib/fares";
import { decodeLegs } from "@/lib/searchParams";
import type { Cabin, TripType } from "@/lib/fares/types";

function cityFor(code: string) {
  return airports.find((a) => a.code === code)?.city ?? code;
}

function fmtDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const get = (key: string, fallback: string) => {
    const v = sp[key];
    return Array.isArray(v) ? v[0] ?? fallback : v ?? fallback;
  };

  const origin = get("from", "KHI").toUpperCase();
  const destination = get("to", "DXB").toUpperCase();
  const departDate = get("depart", "");
  const returnDate = get("return", "") || undefined;
  const tripType = get("tripType", "roundtrip") as TripType;
  const cabin = get("cabin", "Economy") as Cabin;
  const adults = Number(get("adults", "1")) || 1;
  const children = Number(get("children", "0")) || 0;
  const infants = Number(get("infants", "0")) || 0;

  const paxLabel = `${adults + children}${infants ? ` + ${infants} infant${infants > 1 ? "s" : ""}` : ""}`;
  const provider = getFareProvider();

  const legs = tripType === "multicity" ? decodeLegs(get("legs", "")) : [];

  if (tripType === "multicity" && legs.length >= 2) {
    const legResults = await Promise.all(
      legs.map((l) =>
        provider.searchFlights({
          origin: l.from,
          destination: l.to,
          departDate: l.depart,
          tripType: "oneway",
          cabin,
          adults,
          children,
          infants,
        })
      )
    );
    const chainTitle = [legs[0].from, ...legs.map((l) => l.to)].map(cityFor).join(" → ");

    return (
      <>
        <PageHero
          eyebrow="Multi-City Results"
          title={chainTitle}
          description={`${legs.length} flights · ${paxLabel} traveler${
            adults + children > 1 ? "s" : ""
          } · ${cabin}`}
        />

        <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <ArrowLeftRight size={14} />
              {legs.length} flights
            </div>
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-brand-700 transition hover:border-brand-300 hover:bg-brand-50"
            >
              <Pencil size={13} />
              Edit search
            </Link>
          </div>

          <div className="space-y-10">
            {legs.map((l, i) => (
              <div key={`${l.from}-${l.to}-${l.depart}`}>
                <h2 className="mb-3 font-heading text-sm font-bold text-brand-700">
                  Flight {i + 1} · {cityFor(l.from)} → {cityFor(l.to)} · {fmtDate(l.depart)}
                </h2>
                <FlightResults offers={legResults[i]} />
              </div>
            ))}
          </div>
        </section>
      </>
    );
  }

  const sameCity = origin === destination;
  const offers = sameCity
    ? []
    : await provider.searchFlights({
        origin,
        destination,
        departDate,
        returnDate,
        tripType,
        cabin,
        adults,
        children,
        infants,
      });

  return (
    <>
      <PageHero
        eyebrow="Search Results"
        title={`${cityFor(origin)} → ${cityFor(destination)}`}
        description={
          departDate
            ? `${departDate}${returnDate ? ` – ${returnDate}` : ""} · ${paxLabel} traveler${adults + children > 1 ? "s" : ""} · ${cabin}`
            : `${paxLabel} traveler${adults + children > 1 ? "s" : ""} · ${cabin}`
        }
      />

      {departDate && tripType !== "multicity" && !sameCity && (
        <FlexDateStrip
          origin={origin}
          destination={destination}
          departDate={departDate}
          returnDate={returnDate}
          tripType={tripType}
          cabin={cabin}
          adults={adults}
          childCount={children}
          infants={infants}
        />
      )}

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <ArrowLeftRight size={14} />
            {origin} → {destination}
          </div>
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-brand-700 transition hover:border-brand-300 hover:bg-brand-50"
          >
            <Pencil size={13} />
            Edit search
          </Link>
        </div>

        {sameCity ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
            Your origin and destination are the same.{" "}
            <Link href="/" className="font-semibold text-brand-700 hover:underline">
              Edit your search
            </Link>{" "}
            to pick two different cities.
          </div>
        ) : (
          <FlightResultsBrowser
            key={`${origin}-${destination}-${departDate}-${returnDate ?? ""}-${cabin}-${tripType}`}
            offers={offers}
          />
        )}
      </section>
    </>
  );
}
