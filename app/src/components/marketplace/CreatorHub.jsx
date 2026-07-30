export function CreatorHub() {
  return (
    <div class="mx-auto flex max-w-7xl flex-col gap-6 px-2 pb-10">
      <section class="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,_rgba(17,24,39,0.96),_rgba(8,15,25,0.96))] p-6 shadow-[0_35px_90px_rgba(0,0,0,0.42)]">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div class="mb-3 inline-flex items-center rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-violet-200">
              Creator Workspace
            </div>
            <h2 class="text-3xl font-semibold text-white">Upload, verify, and monetize assets at scale</h2>
            <p class="mt-3 max-w-2xl text-sm leading-7 text-slate-300">Manage pricing, approvals, analytics, revenue, and publishing workflows from a premium creator dashboard.</p>
          </div>
          <button class="rounded-full bg-cyan-400/15 px-5 py-2.5 text-sm font-semibold text-cyan-200">Publish Asset</button>
        </div>
      </section>

      <section class="grid gap-6 xl:grid-cols-3">
        <div class="rounded-[24px] border border-white/10 bg-[#0b0f17]/90 p-5">
          <h3 class="text-lg font-semibold text-white">Revenue overview</h3>
          <div class="mt-4 text-3xl font-semibold text-white">$184,920</div>
          <p class="mt-2 text-sm text-slate-400">Tracked from verified sales and premium subscriptions.</p>
        </div>
        <div class="rounded-[24px] border border-white/10 bg-[#0b0f17]/90 p-5">
          <h3 class="text-lg font-semibold text-white">Pending approvals</h3>
          <div class="mt-4 text-3xl font-semibold text-white">14</div>
          <p class="mt-2 text-sm text-slate-400">Assets waiting for anti-piracy and quality review.</p>
        </div>
        <div class="rounded-[24px] border border-white/10 bg-[#0b0f17]/90 p-5">
          <h3 class="text-lg font-semibold text-white">Active licenses</h3>
          <div class="mt-4 text-3xl font-semibold text-white">3,812</div>
          <p class="mt-2 text-sm text-slate-400">Live licenses with versioned updates and download history.</p>
        </div>
      </section>
    </div>
  );
}
