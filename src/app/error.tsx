"use client";

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { siteConfig } from "@/data/site";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center sm:px-6">
      <h1 className="font-heading text-3xl font-extrabold text-brand-950">Something went wrong</h1>
      <p className="mt-2 text-slate-600">
        We hit an unexpected error loading this page. Try again, or reach our team directly.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          onClick={reset}
          className="flex items-center gap-2 rounded-xl bg-brand-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-800"
        >
          <RefreshCw size={15} />
          Try again
        </button>
        <a
          href={`https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-bold text-brand-700 transition hover:bg-brand-50"
        >
          WhatsApp support
        </a>
      </div>
    </section>
  );
}
