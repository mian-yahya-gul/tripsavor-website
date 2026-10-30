"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { destinations } from "@/data/destinations";
import Price from "@/components/Price";
import { useT } from "@/lib/i18n";
import { buildSearchQuery } from "@/lib/searchParams";

function isoIn(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function DestinationsGrid() {
  const t = useT();
  const depart = useMemo(() => isoIn(21), []);
  const ret = useMemo(() => isoIn(28), []);

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {destinations.map((d, i) => (
        <Link
          key={d.code}
          href={`/search?${buildSearchQuery({
            from: "KHI",
            to: d.code,
            depart,
            ret,
            tripType: "roundtrip",
            cabin: "Economy",
            adults: 1,
            children: 0,
            infants: 0,
          })}`}
          className={`group relative isolate overflow-hidden rounded-2xl bg-brand-900 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-950/25 ${
            i === 0
              ? "col-span-2 aspect-[16/9] lg:row-span-2 lg:aspect-auto"
              : i === destinations.length - 1
                ? "aspect-[4/5] sm:aspect-[4/3] lg:col-span-2 lg:aspect-auto"
                : "aspect-[4/5] sm:aspect-[4/3]"
          }`}
        >
          <Image
            src={d.image}
            alt={`${d.city}, ${d.country}`}
            fill
            sizes={i === 0 ? "(min-width:1024px) 50vw, 100vw" : "(min-width:1024px) 25vw, 50vw"}
            className="photo-grade object-cover transition duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/20 to-transparent" />
          <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-brand-800 opacity-0 transition duration-300 group-hover:opacity-100">
            <ArrowUpRight size={16} />
          </span>
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
            <p className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-white/70">
              <MapPin size={11} />
              {t(d.country)}
            </p>
            <h3 className={`mt-1 font-heading font-bold text-white ${i === 0 ? "text-2xl sm:text-3xl" : "text-lg"}`}>
              {t(d.city)}
            </h3>
            <p
              className={`mt-1 hidden text-xs text-white/75 transition-all duration-300 sm:block ${
                i === 0 ? "" : "max-h-0 opacity-0 group-hover:max-h-10 group-hover:opacity-100"
              }`}
            >
              {t(d.tagline)}
            </p>
            <p className="mt-2 inline-flex items-center rounded-full bg-white/15 px-2.5 py-1 text-xs text-white backdrop-blur">
              {t("from")}&nbsp;
              <Price pkr={d.fromPrice} className="font-bold text-accent-400" />
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
