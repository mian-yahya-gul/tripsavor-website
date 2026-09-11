import Link from "next/link";
import { Compass, Home } from "lucide-react";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center sm:px-6">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
        <Compass size={26} />
      </span>
      <h1 className="mt-5 font-heading text-3xl font-extrabold text-brand-950">Page not found</h1>
      <p className="mt-2 text-slate-600">
        The page you&apos;re after has moved or never existed. Let&apos;s get you back on track.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl bg-brand-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-800"
        >
          <Home size={15} />
          Home
        </Link>
        <Link
          href="/explore"
          className="flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-bold text-brand-700 transition hover:bg-brand-50"
        >
          <Compass size={15} />
          Explore destinations
        </Link>
      </div>
    </section>
  );
}
