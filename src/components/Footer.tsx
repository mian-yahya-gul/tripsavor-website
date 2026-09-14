import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { airlinesWeCompare, footerLinks, siteConfig } from "@/data/site";

export default function Footer() {
  return (
    <footer className="bg-brand-950 text-brand-100">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center">
              <Image
                src="/tripsavor-logo.png"
                alt={siteConfig.name}
                width={1654}
                height={482}
                className="h-11 w-auto object-contain brightness-0 invert"
              />
            </div>
            <p className="text-sm leading-relaxed text-brand-100/80">
              Pakistan-based flight booking made simple — transparent fares, real human
              support, and a booking flow that gets you from search to ticket in minutes.
            </p>
            <div className="mt-5 flex gap-3">
              {[
                { initial: "f", href: siteConfig.social.facebook, label: "Facebook" },
                { initial: "in", href: siteConfig.social.instagram, label: "Instagram" },
                { initial: "yt", href: siteConfig.social.youtube, label: "YouTube" },
              ].map(({ initial, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-bold transition hover:bg-accent-500 hover:text-brand-950"
                >
                  {initial}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wide text-white">
              Company
            </h3>
            <ul className="space-y-2.5 text-sm">
              {footerLinks.company.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-brand-100/80 transition hover:text-accent-400">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wide text-white">
              Legal
            </h3>
            <ul className="space-y-2.5 text-sm">
              {footerLinks.legal.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-brand-100/80 transition hover:text-accent-400">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wide text-white">
              Get in Touch
            </h3>
            <ul className="space-y-3 text-sm text-brand-100/80">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="mt-0.5 shrink-0 text-accent-400" />
                {siteConfig.address}
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="shrink-0 text-accent-400" />
                {siteConfig.phone}
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="shrink-0 text-accent-400" />
                {siteConfig.email}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-brand-100/60">
            We compare fares across leading airlines
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-brand-100/70">
            {airlinesWeCompare.map((a) => (
              <span key={a} className="rounded-full border border-white/10 px-3 py-1">
                {a}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-brand-100/60 sm:flex-row">
          <p>© {new Date().getFullYear()} TripSavor. All rights reserved.</p>
          <p>Secure checkout · Cards · Bank Transfer · Cash on Delivery</p>
        </div>
      </div>
    </footer>
  );
}
