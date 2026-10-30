"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { setConsent, useConsent } from "@/lib/consent";
import { useT } from "@/lib/i18n";

export default function CookieBanner() {
  const consent = useConsent();
  const t = useT();
  // Wait for hydration so the banner never flashes for returning visitors.
  const [ready, setReady] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot hydration gate
  useEffect(() => setReady(true), []);

  if (!ready || consent !== "") return null;

  return (
    <div
      role="dialog"
      aria-label={t("Cookie preferences")}
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-brand-950/20 sm:bottom-5 sm:p-5"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 hidden h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 sm:flex">
          <Cookie size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-heading text-sm font-bold text-brand-950">{t("We value your privacy")}</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">
            {t(
              "We use essential storage to remember your language, currency and searches. With your permission we also use analytics to improve the site."
            )}{" "}
            <Link href="/privacy" className="font-semibold text-brand-700 underline">
              {t("Privacy Policy")}
            </Link>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setConsent("all")}
              className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-800"
            >
              {t("Accept all")}
            </button>
            <button
              type="button"
              onClick={() => setConsent("essential")}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-brand-900 transition hover:bg-slate-50"
            >
              {t("Essential only")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
