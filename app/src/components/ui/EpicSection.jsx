export function EpicSection({ title, subtitle, items }) {
  return (
    <section class="mb-8 rounded-[24px] border border-white/10 bg-[#0b0f17]/90 p-5 shadow-[0_20px_45px_rgba(0,0,0,0.35)]">
      <div class="mb-4 flex items-end justify-between gap-3">
        <div>
          <h3 class="text-xl font-semibold text-white">{title}</h3>
          <p class="mt-1 text-sm text-slate-400">{subtitle}</p>
        </div>
        <button class="text-sm font-medium text-cyan-300 transition hover:text-cyan-200">View All</button>
      </div>
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article class="group overflow-hidden rounded-[20px] border border-white/10 bg-gradient-to-br from-[#131a2b] to-[#090d14] transition hover:-translate-y-1 hover:border-cyan-400/30">
            <div class="h-36 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.25),_transparent_45%),linear-gradient(120deg,_#1d2942_0%,_#090d14_100%)]" />
            <div class="p-4">
              <div class="flex items-center justify-between gap-3">
                <h4 class="text-base font-semibold text-white">{item.title}</h4>
                <span class="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] text-slate-300">{item.tag}</span>
              </div>
              <p class="mt-2 text-sm leading-6 text-slate-400">{item.description}</p>
              <div class="mt-4 flex items-center justify-between text-sm text-slate-300">
                <span>{item.price}</span>
                <button class="rounded-full bg-cyan-400/15 px-3 py-1.5 font-medium text-cyan-200 transition hover:bg-cyan-400/25">Install</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
