import { MapPin, PlaneTakeoff } from "lucide-react";
import { destinations } from "@/data/destinations";
import Price from "@/components/Price";

export default function DestinationsGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {destinations.map((d) => (
        <div
          key={d.code}
          className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-950/10"
        >
          <div className={`flex h-28 items-center justify-center bg-gradient-to-br ${d.gradient}`}>
            <PlaneTakeoff className="text-white/90 transition group-hover:translate-x-1" size={32} />
          </div>
          <div className="p-4">
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <MapPin size={12} />
              {d.country}
            </div>
            <h3 className="mt-1 font-heading text-lg font-bold text-brand-950">{d.city}</h3>
            <p className="mt-2 text-xs text-slate-500">
              Fares from <Price pkr={d.fromPrice} className="font-semibold text-accent-600" />
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
