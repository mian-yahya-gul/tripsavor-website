export default function PageHero({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-950 via-brand-900 to-brand-700 py-16 text-center">
      <div className="pointer-events-none absolute inset-0 opacity-20 [background:radial-gradient(circle_at_20%_20%,white,transparent_35%),radial-gradient(circle_at_80%_0%,white,transparent_30%)]" />
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <span className="inline-block rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-accent-400">
          {eyebrow}
        </span>
        <h1 className="mt-4 font-heading text-3xl font-extrabold text-white sm:text-4xl">{title}</h1>
        {description && <p className="mx-auto mt-3 max-w-xl text-brand-100/80">{description}</p>}
      </div>
    </section>
  );
}
