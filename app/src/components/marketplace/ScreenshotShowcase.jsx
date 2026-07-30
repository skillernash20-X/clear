export function ScreenshotShowcase({ title, subtitle, items }) {
  return (
    <section class="rounded-[24px] border border-white/10 bg-[#0b0f17]/90 p-5 shadow-[0_20px_45px_rgba(0,0,0,0.35)]">
      <div class="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 class="text-xl font-semibold text-white">{title}</h3>
          <p class="mt-1 text-sm text-slate-400">{subtitle}</p>
        </div>
        <div class="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-200">
          Spider Games Studio
        </div>
      </div>
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {items.map((item, index) => (
          <article class="overflow-hidden rounded-[20px] border border-white/10 bg-gradient-to-br from-[#111827] to-[#06070c]" key={index}>
            <div class={`h-28 border-b border-white/10 bg-gradient-to-br ${item.tint}`} />
            <div class="p-4">
              <div class="flex items-center justify-between gap-2">
                <h4 class="text-sm font-semibold text-white">{item.title}</h4>
                <span class="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.25em] text-slate-300">{item.tag}</span>
              </div>
              <p class="mt-2 text-sm leading-6 text-slate-400">{item.caption}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
