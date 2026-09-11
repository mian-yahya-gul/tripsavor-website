import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { Plane } from "lucide-react";
import { airlinesWeCompare } from "@/data/site";

/**
 * Renders a real logo file for an airline the moment one exists at
 * public/airlines/<slug>.(svg|png|webp) — see the README in that folder for
 * exact expected filenames. Falls back to a text wordmark badge for any
 * airline whose file hasn't been added yet, so the strip always renders
 * cleanly either way.
 */

const LOGO_DIR = path.join(process.cwd(), "public", "airlines");
const EXTENSIONS = ["svg", "png", "webp"];

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function findLogoUrl(name: string): string | null {
  const slug = slugify(name);
  for (const ext of EXTENSIONS) {
    if (fs.existsSync(path.join(LOGO_DIR, `${slug}.${ext}`))) {
      return `/airlines/${slug}.${ext}`;
    }
  }
  return null;
}

/**
 * Airline wordmarks aren't cropped to a consistent visual weight — some fill
 * their canvas edge-to-edge (Emirates, Etihad) while others sit in a
 * short band with lots of empty space above/below (British Airways,
 * Oman Air, Malindo Air, Kuwait Airways). object-contain alone makes those
 * ones read as noticeably smaller, so nudge per-logo scale to even that out.
 */
const LOGO_SCALE: Record<string, number> = {
  "british-airways": 1.35,
  "oman-air": 1.3,
  airblue: 1.3,
  "malindo-air": 1.3,
  "kuwait-airways": 1.2,
  emirates: 0.82,
};

export default function AirlineMarquee() {
  const airlines = airlinesWeCompare.map((name) => ({
    name,
    slug: slugify(name),
    logoUrl: findLogoUrl(name),
  }));
  const items = [...airlines, ...airlines];

  return (
    <section className="border-y border-brand-100 bg-white py-8">
      <p className="mb-5 text-center text-xs font-bold uppercase tracking-[0.2em] text-brand-700">
        Popular Airlines
      </p>
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="marquee-track flex w-max items-center gap-10 sm:gap-14">
          {items.map(({ name, slug, logoUrl }, i) => (
            <span
              key={`${name}-${i}`}
              aria-hidden={i >= airlines.length}
              className="flex h-10 w-28 shrink-0 items-center justify-center sm:h-12 sm:w-32"
            >
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={name}
                  width={120}
                  height={40}
                  className="h-full w-full object-contain"
                  style={{ transform: `scale(${LOGO_SCALE[slug] ?? 1})` }}
                />
              ) : (
                <span className="flex items-center gap-2 text-slate-400">
                  <Plane size={16} className="shrink-0" />
                  <span className="whitespace-nowrap font-heading text-base font-bold sm:text-lg">{name}</span>
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
