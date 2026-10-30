import Image from "next/image";
import CountUp from "@/components/CountUp";
import T from "@/components/T";
import { airports } from "@/data/airports";

/** Full-bleed photo band that breaks up the white/tinted section rhythm on the homepage. */
export default function StatsBand() {
  const stats = [
    { to: airports.length, suffix: "", label: "Airports covered" },
    { to: 15, suffix: "+", label: "Airlines compared" },
    { to: 24, suffix: "/7", label: "Human support" },
    { to: 0, suffix: "", label: "Hidden fees" },
  ];

  return (
    <section className="relative isolate overflow-hidden py-16 sm:py-24">
      <Image
        src="/destinations/istanbul.jpg"
        alt=""
        fill
        sizes="100vw"
        quality={60}
        className="photo-grade -z-20 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-950/90 via-brand-950/75 to-brand-900/60" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="max-w-xl font-heading text-2xl font-bold leading-snug text-white sm:text-4xl">
          <T>Fly anywhere. Pay a fair price. Talk to a real person.</T>
        </p>
        <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="border-l-2 border-accent-500 pl-4">
              <dt className="font-heading text-4xl font-extrabold text-white sm:text-5xl">
                <CountUp to={s.to} suffix={s.suffix} />
              </dt>
              <dd className="mt-1 text-sm font-medium text-brand-100/80">
                <T>{s.label}</T>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
