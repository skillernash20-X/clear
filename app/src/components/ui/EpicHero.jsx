export function EpicHero() {
  return (
    <section class="mb-8 overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(91,140,255,0.28),_transparent_45%),linear-gradient(135deg,_#070b14_0%,_#10172a_45%,_#05070d_100%)] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
      <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-2xl">
          <div class="mb-3 inline-flex items-center rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-200">
            Featured Experience
          </div>
          <h2 class="text-3xl font-semibold text-white sm:text-4xl">Discover your next premium launch</h2>
          <p class="mt-3 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
            Browse a curated storefront of blockbuster titles, exclusive updates, and a polished library experience designed for serious players.
          </p>
          <div class="mt-6 flex flex-wrap gap-3">
            <button class="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:scale-[1.01]">
              Play Now
            </button>
            <button class="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/90 transition hover:bg-white/10">
              View Store
            </button>
          </div>
        </div>
        <div class="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-300 backdrop-blur">
          <div class="text-[11px] uppercase tracking-[0.3em] text-slate-500">Live status</div>
          <div class="mt-2 text-xl font-semibold text-white">Cloud sync • Auto updates • Secure login</div>
        </div>
      </div>
    </section>
  );
}
