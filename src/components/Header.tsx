"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Calculator,
  Compass,
  Contact,
  FileText,
  Home,
  Info,
  Menu,
  Phone,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { siteConfig } from "@/data/site";
import CurrencyControl from "@/components/CurrencyControl";

const iconNavLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/group-tickets", label: "Group Tickets", icon: Users },
  { href: "/umrah-calculator", label: "Umrah Calculator", icon: Calculator },
  { href: "/manage-booking", label: "Manage Booking", icon: FileText },
  { href: "/about", label: "About Us", icon: Info },
  { href: "/contact", label: "Contact Us", icon: Contact },
  { href: "/login", label: "SignUp/Login", icon: UserRound },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-brand-100 bg-white/95 backdrop-blur">
      <div className="bg-brand-950 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-end gap-4 px-4 py-1.5 text-xs sm:px-6 lg:px-8">
          <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="flex items-center gap-1.5 hover:text-accent-400">
            <Phone size={12} />
            {siteConfig.phone}
          </a>
          <span className="hidden text-brand-400 sm:inline">|</span>
          <span className="hidden sm:inline">{siteConfig.hours}</span>
          <span className="text-brand-400">|</span>
          <CurrencyControl />
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/tripsavor-logo.png"
            alt={siteConfig.name}
            width={1654}
            height={482}
            priority
            className="h-11 w-auto object-contain sm:h-12"
          />
        </Link>

        <button
          className="rounded-lg p-2 text-brand-900 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <nav className="hidden border-t border-brand-100 bg-brand-50/60 md:block">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center divide-x divide-brand-100 px-4 lg:px-8">
          {iconNavLinks.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-bold transition ${
                  active ? "text-brand-700" : "text-brand-900/80 hover:text-brand-700"
                }`}
              >
                <Icon size={17} className={active ? "text-brand-700" : "text-brand-600"} />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>

      {open && (
        <div className="border-t border-brand-100 bg-white px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {iconNavLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-bold text-brand-900/80 hover:bg-brand-50 hover:text-brand-700"
              >
                <Icon size={17} className="text-brand-600" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
