function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="skeleton h-11 w-11 shrink-0 rounded-xl" />
          <div className="space-y-2">
            <div className="skeleton h-3.5 w-40 rounded" />
            <div className="skeleton h-3 w-56 rounded" />
            <div className="skeleton h-2.5 w-32 rounded" />
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
          <div className="skeleton h-6 w-24 rounded" />
          <div className="skeleton h-9 w-36 rounded-lg" />
        </div>
      </div>
      <div className="skeleton mx-5 mb-4 h-3 w-48 rounded" />
    </div>
  );
}

export default function SearchLoading() {
  return (
    <>
      <section className="relative bg-gradient-to-b from-brand-950 via-brand-900 to-brand-700 py-16">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 px-4">
          <div className="skeleton skeleton-dark h-5 w-40 rounded-full" />
          <div className="skeleton skeleton-dark h-8 w-72 rounded" />
          <div className="skeleton skeleton-dark h-4 w-56 rounded" />
        </div>
      </section>

      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="skeleton mb-3 h-3 w-24 rounded" />
          <div className="flex gap-2 overflow-hidden">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="skeleton h-16 flex-1 rounded-xl" />
            ))}
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="skeleton h-4 w-28 rounded" />
          <div className="skeleton h-8 w-28 rounded-lg" />
        </div>

        <div className="lg:grid lg:grid-cols-[15rem_1fr] lg:gap-8">
          <aside className="hidden lg:block">
            <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5">
              <div className="skeleton h-4 w-20 rounded" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="skeleton h-3 w-24 rounded" />
                  <div className="skeleton h-8 w-full rounded" />
                </div>
              ))}
            </div>
          </aside>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <div className="skeleton h-4 w-24 rounded" />
              <div className="skeleton h-8 w-40 rounded-lg" />
            </div>
            <div className="skeleton mb-4 h-14 w-full rounded-xl" />
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
