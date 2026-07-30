import { createEffect, createSignal, For, Show } from "solid-js";
import { invoke } from "@tauri-apps/api/core";

const tabs = ["Discover", "Store", "Library", "Creators", "Cart"];

const featuredAssets = [
  { title: "Neon City Pack", category: "Environments", price: "$89", rating: "4.9", color: "from-cyan-500/20 to-violet-500/20" },
  { title: "Void Warrior Rig", category: "Characters", price: "$129", rating: "4.8", color: "from-fuchsia-500/20 to-purple-500/20" },
  { title: "Horizon Audio Suite", category: "Audio", price: "$49", rating: "4.7", color: "from-blue-500/20 to-cyan-500/20" },
];

const sections = [
  { title: "Trending 3D Assets", items: [
    { title: "Cyber Streets Kit", price: "$79", tag: "3D Models" },
    { title: "Lumen Materials", price: "$39", tag: "Materials" },
    { title: "Storm VFX Bundle", price: "$99", tag: "VFX" },
  ]},
  { title: "Top Creators", items: [
    { title: "Astra Forge", price: "12.4k sales", tag: "Environment Artist" },
    { title: "Nova Studio", price: "8.2k sales", tag: "Technical Artist" },
    { title: "Zero Pulse", price: "6.9k sales", tag: "Audio Designer" },
  ]},
];

export function MarketplaceShell() {
  const [activeTab, setActiveTab] = createSignal("Discover");
  const [assets, setAssets] = createSignal([]);
  const [creators, setCreators] = createSignal([]);
  const [securityStatus, setSecurityStatus] = createSignal(null);

  createEffect(() => {
    async function loadMarketplaceData() {
      try {
        const featured = await invoke("run_launcher_core", { action: "marketplace_features", payload: "" });
        const parsedFeatured = JSON.parse(featured);
        setAssets(parsedFeatured);

        const creatorsPayload = await invoke("run_launcher_core", { action: "marketplace_creators", payload: "" });
        const parsedCreators = JSON.parse(creatorsPayload);
        setCreators(parsedCreators);

        const security = await invoke("run_launcher_core", { action: "marketplace_security", payload: "" });
        setSecurityStatus(JSON.parse(security));
      } catch (error) {
        console.error(error);
      }
    }

    loadMarketplaceData();
  });

  return (
    <div class="mx-auto flex max-w-7xl flex-col gap-6 px-2 pb-10">
      <header class="rounded-[30px] border border-white/10 bg-[linear-gradient(135deg,_rgba(12,20,39,0.98),_rgba(6,10,19,0.98))] p-6 shadow-[0_35px_90px_rgba(0,0,0,0.45)]">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div class="mb-3 inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-200">
              Epic-style digital marketplace
            </div>
            <h2 class="text-3xl font-semibold text-white sm:text-4xl">Fab-inspired storefront for premium digital assets</h2>
            <p class="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Discover, buy, download, and manage thousands of professional assets for games, films, and creator projects with secure licensing and powerful discovery tools.
            </p>
          </div>
          <div class="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-300 backdrop-blur">
            <div class="text-[11px] uppercase tracking-[0.3em] text-slate-500">Platform status</div>
            <div class="mt-2 text-xl font-semibold text-white">Secure payments • Instant downloads • Verified creators</div>
          </div>
        </div>

        <div class="mt-6 flex flex-wrap gap-2">
          <For each={tabs}>{(tab) => (
            <button class={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab() === tab ? "bg-cyan-400/20 text-cyan-200" : "bg-white/5 text-slate-300 hover:bg-white/10"}`} onClick={() => setActiveTab(tab)}>
              {tab}
            </button>
          )}</For>
        </div>
      </header>

      <section class="grid gap-6 xl:grid-cols-[1.7fr_0.9fr]">
        <div class="overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(73,180,255,0.28),_transparent_40%),linear-gradient(135deg,_#060b14_0%,_#111a2e_45%,_#06070c_100%)] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.4)]">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-[11px] uppercase tracking-[0.3em] text-cyan-200/80">Featured collection</div>
              <h3 class="mt-2 text-2xl font-semibold text-white">The ultimate AAA asset drop</h3>
            </div>
            <button class="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90">Explore</button>
          </div>
          <div class="mt-6 grid gap-4 md:grid-cols-3">
            <For each={assets()}>{(asset) => (
              <article class="rounded-[22px] border border-white/10 bg-gradient-to-br from-cyan-500/20 to-violet-500/20 p-4">
                <div class="h-24 rounded-[16px] border border-white/10 bg-black/20" />
                <div class="mt-4">
                  <div class="flex items-center justify-between gap-3">
                    <h4 class="text-base font-semibold text-white">{asset.title}</h4>
                    <span class="text-sm text-cyan-200">★ {asset.rating}</span>
                  </div>
                  <p class="mt-2 text-sm text-slate-300">{asset.category}</p>
                  <div class="mt-4 flex items-center justify-between">
                    <span class="text-sm font-semibold text-white">{asset.price}</span>
                    <button class="rounded-full bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/20">Buy</button>
                  </div>
                </div>
              </article>
            )}</For>
          </div>
        </div>

        <aside class="rounded-[28px] border border-white/10 bg-[#0a0f18]/95 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
          <div class="text-[11px] uppercase tracking-[0.3em] text-slate-500">Marketplace intelligence</div>
          <div class="mt-4 space-y-4">
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div class="text-sm text-slate-400">Verified creators</div>
              <div class="mt-1 text-2xl font-semibold text-white">{creators().length}</div>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div class="text-sm text-slate-400">Assets live</div>
              <div class="mt-1 text-2xl font-semibold text-white">{assets().length}</div>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div class="text-sm text-slate-400">Secure transactions</div>
              <div class="mt-1 text-2xl font-semibold text-white">{securityStatus()?.security ?? "bank-grade"}</div>
            </div>
          </div>
        </aside>
      </section>

      <Show when={activeTab() !== "Cart"}>
        <For each={sections}>{(section) => (
          <section class="rounded-[24px] border border-white/10 bg-[#0b0f17]/90 p-5 shadow-[0_20px_45px_rgba(0,0,0,0.35)]">
            <div class="mb-4 flex items-end justify-between gap-3">
              <div>
                <h3 class="text-xl font-semibold text-white">{section.title}</h3>
                <p class="mt-1 text-sm text-slate-400">Curated for professional pipelines and indie studios.</p>
              </div>
              <button class="text-sm font-medium text-cyan-300 transition hover:text-cyan-200">View all</button>
            </div>
            <div class="grid gap-4 md:grid-cols-3">
              <For each={section.items}>{(item) => (
                <article class="rounded-[20px] border border-white/10 bg-gradient-to-br from-[#131a2b] to-[#090d14] p-4">
                  <div class="h-28 rounded-[16px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.25),_transparent_45%),linear-gradient(120deg,_#1d2942_0%,_#090d14_100%)]" />
                  <div class="mt-4 flex items-center justify-between gap-3">
                    <h4 class="text-base font-semibold text-white">{item.title}</h4>
                    <span class="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] uppercase tracking-[0.25em] text-slate-300">{item.tag}</span>
                  </div>
                  <div class="mt-3 flex items-center justify-between text-sm text-slate-300">
                    <span>{item.price}</span>
                    <button class="rounded-full bg-cyan-400/15 px-3 py-1.5 font-medium text-cyan-200">Open</button>
                  </div>
                </article>
              )}</For>
            </div>
          </section>
        )}</For>
      </Show>

      <Show when={activeTab() === "Cart"}>
        <section class="rounded-[24px] border border-white/10 bg-[#0b0f17]/90 p-6 shadow-[0_20px_45px_rgba(0,0,0,0.35)]">
          <h3 class="text-xl font-semibold text-white">Secure cart and checkout</h3>
          <p class="mt-2 text-sm text-slate-400">Encrypted billing, license delivery, and instant downloads after purchase.</p>
          <div class="mt-6 rounded-[20px] border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
            Checkout flow, payment vault, order history, and download unlocks are available via the marketplace service layer.
          </div>
        </section>
      </Show>
    </div>
  );
}
