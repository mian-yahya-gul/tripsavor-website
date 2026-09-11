"use client";

import { useState } from "react";
import { Check, Copy, Plane, UtensilsCrossed } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Price from "@/components/Price";
import { type GroupCategoryId, groupCategories, groupRoutes } from "@/data/groupTickets";
import { GroupCategoryArt } from "@/components/icons/GroupCategoryArt";

function CategoryTile({
  id,
  label,
  gradient,
  onSelect,
  className = "",
}: {
  id: GroupCategoryId;
  label: string;
  gradient: string;
  onSelect: (id: GroupCategoryId) => void;
  className?: string;
}) {
  return (
    <button
      onClick={() => onSelect(id)}
      className={`group relative flex flex-col justify-end overflow-hidden rounded-2xl text-left transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-950/20 ${className}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      <GroupCategoryArt
        category={id}
        className="absolute -right-3 -top-2 h-24 w-32 text-white/20 transition group-hover:scale-105"
      />
      <div className="relative bg-gradient-to-t from-black/70 via-black/10 to-transparent px-4 py-3">
        <span className="font-heading text-sm font-bold text-white sm:text-base">{label}</span>
      </div>
    </button>
  );
}

export default function GroupTicketsExplorer() {
  const [active, setActive] = useState<GroupCategoryId | "all">("all");
  const [copiedRef, setCopiedRef] = useState<string | null>(null);

  const filteredRoutes = active === "all" ? groupRoutes : groupRoutes.filter((r) => r.category === active);

  const selectCategory = (id: GroupCategoryId | "all") => {
    setActive(id);
    document.getElementById("listing")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const copyRef = async (ref: string) => {
    try {
      await navigator.clipboard.writeText(ref);
      setCopiedRef(ref);
      setTimeout(() => setCopiedRef((r) => (r === ref ? null : r)), 1500);
    } catch {
      // clipboard unavailable — silently ignore
    }
  };

  const byId = (id: GroupCategoryId) => groupCategories.find((c) => c.id === id)!;

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-950 via-brand-900 to-brand-700 pb-16 pt-8">
        <div className="pointer-events-none absolute inset-0 opacity-20 [background:radial-gradient(circle_at_20%_20%,white,transparent_35%),radial-gradient(circle_at_80%_0%,white,transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl overflow-x-auto px-4 pb-8 sm:px-6 lg:px-8">
          <div className="flex w-max items-center gap-0.5 divide-x divide-white/10 sm:w-full sm:justify-between">
            {groupCategories.map((c) => (
              <button
                key={c.id}
                onClick={() => selectCategory(c.id)}
                className={`flex items-center gap-2 whitespace-nowrap px-3.5 py-2 text-sm font-semibold transition sm:px-4 ${
                  active === c.id ? "text-accent-400" : "text-white/80 hover:text-accent-400"
                }`}
              >
                <c.icon size={16} />
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="flex flex-col justify-center">
            <span className="w-fit rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-accent-400">
              Group Ticketing Portal
            </span>
            <h1 className="mt-4 font-heading text-4xl font-extrabold text-white sm:text-5xl">
              TripSavor Group Tickets
            </h1>
            <p className="mt-4 max-w-md text-brand-100/80">
              Pre-negotiated group fares for Umrah &amp; Hajj, UAE, KSA, UK and more — built for
              organizers moving 10 or more travelers together.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => selectCategory("all")}
                className="rounded-xl bg-accent-500 px-6 py-3 font-heading text-sm font-bold text-brand-950 shadow-md transition hover:bg-accent-400"
              >
                Browse Live Group Fares
              </button>
              <a
                href="#request-quote"
                className="rounded-xl border border-white/20 px-6 py-3 font-heading text-sm font-bold text-white transition hover:bg-white/10"
              >
                Request a Custom Quote
              </a>
            </div>
          </div>

          <div className="grid h-[360px] grid-cols-2 grid-rows-2 gap-3 sm:h-[420px]">
            <CategoryTile {...byId("umrah")} onSelect={selectCategory} className="col-span-1 row-span-2" />
            <CategoryTile {...byId("uae")} onSelect={selectCategory} />
            <CategoryTile {...byId("ksa")} onSelect={selectCategory} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {(["uk", "qatar", "muscat", "bahrain"] as GroupCategoryId[]).map((id) => (
            <CategoryTile key={id} {...byId(id)} onSelect={selectCategory} className="h-32" />
          ))}
        </div>
      </section>

      <section id="listing" className="scroll-mt-20 bg-brand-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Live Availability"
            title="TripSavor Group Tickets"
            description="Sample group fares shown below are for illustration — our team confirms final pricing and seat availability before you pay."
          />

          <div className="mt-8 flex flex-wrap gap-2">
            <button
              onClick={() => setActive("all")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                active === "all" ? "bg-brand-600 text-white shadow-sm" : "bg-white text-slate-600 hover:text-brand-700"
              }`}
            >
              All
            </button>
            {groupCategories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active === c.id ? "bg-brand-600 text-white shadow-sm" : "bg-white text-slate-600 hover:text-brand-700"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="mt-8 space-y-8">
            {filteredRoutes.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-brand-200 bg-white p-8 text-center text-sm text-slate-500">
                No sample group fares listed for this category yet — request a custom quote below
                and our team will put one together for you.
              </p>
            ) : (
              filteredRoutes.map((route) => (
                <div key={route.route} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-5 py-3">
                    <span className="font-heading text-sm font-bold text-brand-700">{route.airline}</span>
                    <span className="flex items-center gap-2 font-heading text-base font-bold text-brand-950">
                      <Plane size={16} className="text-brand-600" />
                      {route.route}
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[680px] text-left text-sm">
                      <thead>
                        <tr className="bg-brand-950 text-xs font-semibold uppercase tracking-wide text-white">
                          <th className="px-5 py-2.5">Date</th>
                          <th className="px-5 py-2.5">Flight</th>
                          <th className="px-5 py-2.5">Time</th>
                          <th className="px-5 py-2.5">Bag</th>
                          <th className="px-5 py-2.5">Meal</th>
                          <th className="px-5 py-2.5">Fare</th>
                          <th className="px-5 py-2.5" />
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-50">
                        {route.flights.map((f) => (
                          <tr key={f.ref} className="bg-brand-50/40">
                            <td className="whitespace-nowrap px-5 py-3.5 font-medium text-slate-700">{f.date}</td>
                            <td className="whitespace-nowrap px-5 py-3.5 text-slate-700">{f.flightNo}</td>
                            <td className="whitespace-nowrap px-5 py-3.5 text-slate-700">{f.time}</td>
                            <td className="whitespace-nowrap px-5 py-3.5 text-slate-700">{f.bag}</td>
                            <td className="whitespace-nowrap px-5 py-3.5">
                              <span
                                className={`flex items-center gap-1 font-semibold ${
                                  f.meal ? "text-emerald-600" : "text-red-500"
                                }`}
                              >
                                <UtensilsCrossed size={13} />
                                {f.meal ? "YES" : "NO"}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-5 py-3.5 font-heading font-bold text-brand-900">
                              <Price pkr={f.fare} />
                            </td>
                            <td className="whitespace-nowrap px-5 py-3.5">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => copyRef(f.ref)}
                                  className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-brand-300 hover:text-brand-700"
                                >
                                  {copiedRef === f.ref ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                                  {copiedRef === f.ref ? "Copied" : f.ref}
                                </button>
                                <a
                                  href="#request-quote"
                                  className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-brand-700"
                                >
                                  Book Now
                                </a>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}
