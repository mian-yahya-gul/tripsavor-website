"use client";

import { useT } from "@/lib/i18n";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  center = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  center?: boolean;
}) {
  const t = useT();
  return (
    <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <span className="mb-2 inline-block text-sm font-bold uppercase tracking-wide text-accent-600">
          {t(eyebrow)}
        </span>
      )}
      <h2 className="font-heading text-3xl font-bold text-brand-950 sm:text-4xl">{t(title)}</h2>
      {description && <p className="mt-3 text-slate-600">{t(description)}</p>}
    </div>
  );
}
