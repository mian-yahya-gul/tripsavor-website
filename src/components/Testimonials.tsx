import { Star, UserRound } from "lucide-react";
import { testimonials } from "@/data/testimonials";

export default function Testimonials() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      {testimonials.map((t) => (
        <div key={t.name} className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex gap-0.5 text-accent-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={14} fill={i < t.rating ? "currentColor" : "none"} />
            ))}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">&ldquo;{t.quote}&rdquo;</p>
          <div className="mt-5 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-700">
              <UserRound size={18} />
            </span>
            <div>
              <p className="text-sm font-semibold text-brand-950">{t.name}</p>
              <p className="text-xs text-slate-400">{t.location}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
