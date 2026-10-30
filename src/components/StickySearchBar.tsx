"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useT } from "@/lib/i18n";

/** Phone-only bottom bar that appears once the hero search has scrolled away. */
export default function StickySearchBar() {
  const t = useT();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 pb-3 pl-3 pr-20 transition duration-300 md:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
    >
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent-500 font-heading text-base font-bold text-brand-950 shadow-lg shadow-black/25"
      >
        <Search size={18} />
        {t("Search Flights")}
      </button>
    </div>
  );
}
