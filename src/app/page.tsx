import Link from "next/link";
import Reveal from "@/components/Reveal";
import FlightSearchWidget from "@/components/FlightSearchWidget";
import TrustStrip from "@/components/TrustStrip";
import AirlineMarquee from "@/components/AirlineMarquee";
import SectionHeading from "@/components/SectionHeading";
import DestinationsGrid from "@/components/DestinationsGrid";
import DealFeed from "@/components/DealFeed";
import WhyChooseUs from "@/components/WhyChooseUs";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import CtaBanner from "@/components/CtaBanner";

export default function Home() {
  return (
    <>
      <section className="relative bg-gradient-to-b from-brand-950 via-brand-900 to-brand-700 pb-24 pt-16 sm:pt-20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-20 [background:radial-gradient(circle_at_20%_20%,white,transparent_35%),radial-gradient(circle_at_80%_0%,white,transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-block rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-accent-400">
            Pakistan&apos;s Trusted Flight Booking Partner
          </span>
          <h1 className="mx-auto mt-4 max-w-3xl font-heading text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            Book Smarter. <span className="text-accent-400">Fly Further.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-brand-100/80">
            Compare fares across leading airlines and lock in your seat in minutes — with a
            real support team behind every booking.
          </p>
        </div>

        <div className="relative mx-auto mt-10 max-w-5xl px-4 sm:px-6 lg:px-8">
          <FlightSearchWidget />
        </div>
      </section>

      <TrustStrip />

      <div className="mt-12">
        <AirlineMarquee />
      </div>

      <DealFeed />

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Popular Routes"
          title="Where do you want to fly?"
          description="A snapshot of our most-booked international routes this month — fares shown are indicative starting prices."
        />
        <Reveal className="mt-10">
          <DestinationsGrid />
        </Reveal>
        <div className="mt-8 text-center">
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 transition hover:text-brand-900"
          >
            Explore every destination by budget <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      <section className="bg-brand-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="How It Works"
            title="From search to ticket in three steps"
            center
          />
          <Reveal className="mt-12">
            <HowItWorks />
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why TripSavor"
          title="Built around getting you the fair price"
          description="No hidden fees, no bait-and-switch fares — just a straightforward way to book flights."
        />
        <Reveal className="mt-10">
          <WhyChooseUs />
        </Reveal>
      </section>

      <section className="bg-brand-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Reviews" title="What travelers say about us" center />
          <Reveal className="mt-12">
            <Testimonials />
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <CtaBanner />
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:flex-row">
          <p className="text-sm text-slate-600">
            Already have a booking? Retrieve your itinerary and manage it online.
          </p>
          <Link
            href="/manage-booking"
            className="shrink-0 rounded-lg bg-brand-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-800"
          >
            Manage My Booking
          </Link>
        </div>
      </section>
    </>
  );
}
