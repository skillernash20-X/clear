export function AssetDetail() {
  return (
    <div class="mx-auto flex max-w-7xl flex-col gap-6 px-2 pb-10">
      <section class="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,_rgba(12,20,39,0.98),_rgba(6,10,19,0.98))] p-6 shadow-[0_35px_90px_rgba(0,0,0,0.42)]">
        <div class="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <div class="mb-3 inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-200">Asset Preview</div>
            <h2 class="text-3xl font-semibold text-white">Lumen Material Pack</h2>
            <p class="mt-3 max-w-2xl text-sm leading-7 text-slate-300">A premium collection of physically-based materials designed for cinematic environments, stylized worlds, and AAA production pipelines.</p>
          </div>
          <div class="rounded-[24px] border border-white/10 bg-black/20 p-5">
            <div class="text-sm text-slate-400">Price</div>
            <div class="mt-2 text-3xl font-semibold text-white">$74</div>
            <div class="mt-4 flex gap-3">
              <button class="rounded-full bg-cyan-400/15 px-4 py-2 text-sm font-semibold text-cyan-200">Add to cart</button>
              <button class="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90">Wishlist</button>
            </div>
          </div>
        </div>
      </section>

      <section class="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div class="rounded-[24px] border border-white/10 bg-[#0b0f17]/90 p-5">
          <h3 class="text-xl font-semibold text-white">Preview gallery</h3>
          <div class="mt-4 grid gap-4 md:grid-cols-2">
            <div class="h-32 rounded-[18px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.25),_transparent_45%),linear-gradient(120deg,_#1d2942_0%,_#090d14_100%)]" />
            <div class="h-32 rounded-[18px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(167,139,250,0.22),_transparent_45%),linear-gradient(120deg,_#241d3a_0%,_#090d14_100%)]" />
          </div>
        </div>
        <div class="rounded-[24px] border border-white/10 bg-[#0b0f17]/90 p-5">
          <h3 class="text-xl font-semibold text-white">License & security</h3>
          <ul class="mt-4 space-y-3 text-sm text-slate-400">
            <li>• Verified creator and secure delivery</li>
            <li>• Versioned downloads and automatic update support</li>
            <li>• Commercial and personal use licensing controls</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
