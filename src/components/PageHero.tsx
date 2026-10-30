"use client";

import Image from "next/image";
import HeroSky from "@/components/HeroSky";
import { useT } from "@/lib/i18n";

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  /** Background photo path under /public; falls back to the animated sky alone. */
  image?: string;
};

export default function PageHero({ eyebrow, title, description, image }: Props) {
  const t = useT();
  return (
    <section
      className={`relative isolate overflow-hidden bg-gradient-to-b from-brand-950 via-brand-900 to-brand-700 text-center ${
        image ? "py-20 sm:py-28" : "py-16"
      }`}
    >
      {image ? (
        <>
          <Image
            src={image}
            alt=""
            fill
            loading="eager"
            fetchPriority="high"
            quality={60}
            sizes="100vw"
            className="-z-10 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-950/80 via-brand-950/55 to-brand-900/85" />
        </>
      ) : (
        <HeroSky />
      )}
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <span className="inline-block rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-accent-400 backdrop-blur">
          {t(eyebrow)}
        </span>
        <h1 className="mt-4 font-heading text-3xl font-extrabold text-white drop-shadow-sm sm:text-5xl">
          {t(title)}
        </h1>
        {description && <p className="mx-auto mt-3 max-w-xl text-brand-100/90">{t(description)}</p>}
      </div>
    </section>
  );
}
