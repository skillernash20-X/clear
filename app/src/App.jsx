import { createEffect, createMemo, For, onMount, Show } from "solid-js";
import { ModalFrame } from "@/components/modal/ModalFrame";
import { SideBar } from "@/components/sidebar/SideBar.jsx";
import { GameCards } from "@/components/ui/GameCards.jsx";
import { EpicHero } from "@/components/ui/EpicHero.jsx";
import { EpicSection } from "@/components/ui/EpicSection.jsx";
import { MarketplaceShell } from "@/components/marketplace/MarketplaceShell.jsx";
import { CreatorHub } from "@/components/marketplace/CreatorHub.jsx";
import { AssetDetail } from "@/components/marketplace/AssetDetail.jsx";
import { ScreenshotShowcase } from "@/components/marketplace/ScreenshotShowcase.jsx";
import { CoreGamesEditor } from "@/components/editor/CoreGamesEditor.jsx";
import { Hotkeys } from "@/components/ui/Hotkeys.jsx";
import { LanguageSelector } from "@/components/ui/LanguageSelector.jsx";
import { ChevronArrows, EmptyTray, Steam } from "@/libraries/Icons.jsx";
import { getErrorMessage, logError } from "@/utils/errorHandling";
import { fuzzysearch } from "@/utils/fuzzysearch.js";
import { translateText } from "@/utils/translateText";
import "./App.css";
import { Toast } from "@/components/Toast.jsx";
import { ContextMenu } from "@/components/ui/ContextMenu.jsx";
import { getData } from "@/services/libraryService.js";
import { importSteamGames } from "@/services/steamService.js";
import { triggerToast } from "@/stores/toastStore.js";
import { checkIfConnectedToInternet, checkIfConnectedToServer } from "@/utils/internet.js";
import { LoadingModal } from "./components/modal/Loading.jsx";
import { addEventListeners } from "./services/keyboardService.js";
import { toggleSideBar } from "./services/userSettingsService.js";
import { initApplicationStore, windowWidth } from "./stores/applicationStore.js";
import { libraryData } from "./stores/libraryStore.js";
import { closeModal, openModal } from "./stores/modalStore.js";
import { search } from "./stores/searchStore.js";

// import { checkForUpdatesAndNotify } from "@/services/updaterService.js";

function App() {
  async function handleImportSteamGames() {
    try {
      await Promise.all([checkIfConnectedToInternet(), checkIfConnectedToServer()]);
    } catch (e) {
      triggerToast(e.message);
      return;
    }

    try {
      openModal({
        type: "loading",
        component: LoadingModal,
      });

      await importSteamGames();

      closeModal(true);
    } catch (err) {
      closeModal(true);
      triggerToast(`error: ${err.message}`);
    }
  }

  // setting up effects for styles that can be changed in settings
  createEffect(() => {
    document.documentElement.classList.remove("dark", "black");

    const currentTheme = libraryData.userSettings.currentTheme;

    if (currentTheme === "light") return;

    document.documentElement.classList.add(currentTheme);
  });

  createEffect(() => {
    let fontFamily;
    switch (libraryData.userSettings.fontName) {
      case "sans serif":
        fontFamily = "Helvetica, Arial, sans-serif";
        break;
      case "serif":
        fontFamily = "Times New Roman, serif";
        break;
      case "mono":
        fontFamily = "IBM Plex Mono, Consolas, monospace";
        break;
    }
    document.body.style.setProperty("--font-family", fontFamily);
  });

  createEffect(() => {
    document.body.style.setProperty("--border-radius", libraryData.userSettings.roundedBorders ? "6px" : "0px");
  });

  const searchResults = createMemo(() => {
    const query = search()?.toLowerCase().trim();
    if (!query) return;

    const searchResults = [];

    for (const id in libraryData.games) {
      const game = libraryData.games[id];
      const result = fuzzysearch(search(), game.name.toLowerCase().replace("-", " "));
      if (result === true) {
        searchResults.push(id);
      }

      console.log(searchResults);
    }
    return searchResults;
  });

  function returnGridStyleForGameCard(zoomLevel, showSideBar) {
    switch (zoomLevel) {
      case 0:
        if (showSideBar) {
          return "grid-cols-4 medium:grid-cols-5 large:grid-cols-7";
        }
        return "grid-cols-4 medium:grid-cols-6 large:grid-cols-8";
      case 1:
        if (showSideBar) {
          return "grid-cols-3 medium:grid-cols-4 large:grid-cols-6";
        }
        return "grid-cols-3 medium:grid-cols-5 large:grid-cols-7";
      case 2:
        if (showSideBar) {
          return "grid-cols-2 medium:grid-cols-3 large:grid-cols-5";
        }
        return "grid-cols-2 medium:grid-cols-4 large:grid-cols-6";
    }
  }

  onMount(async () => {
    self.addEventListener("error", (event) => {
      logError("app.windowError", event.error ?? new Error(event.message));
    });

    self.addEventListener("unhandledrejection", (event) => {
      logError("app.unhandledRejection", event.reason);
      triggerToast(getErrorMessage(event.reason));
    });

    // fetches library data and populates the ui
    try {
      await getData();
    } catch (err) {
      triggerToast(err.message);
    }

    initApplicationStore();

    addEventListeners();

    try {
      await Promise.all([checkIfConnectedToInternet(), checkIfConnectedToServer()]);
    } catch (e) {
      triggerToast(e.message);
      return;
    }

    // try {
    //   await checkForUpdatesAndNotify();
    // } catch (err) {
    // triggerToast(err.message);
    // }
  });

  const featuredSections = [
    {
      title: "Featured Titles",
      subtitle: "Premium launches and curated highlights",
      items: [
        { title: "Neon Rift", tag: "Action", description: "Fast-paced combat with cinematic visuals.", price: "$59.99" },
        { title: "Starfall Legends", tag: "RPG", description: "A deep single-player experience with rich lore.", price: "$49.99" },
        { title: "Volt Arena", tag: "Multiplayer", description: "Competitive online battles and instant matchmaking.", price: "$29.99" },
      ],
    },
    {
      title: "Recommended for You",
      subtitle: "Based on your recent activity",
      items: [
        { title: "Aurora Vault", tag: "Adventure", description: "Explore a futuristic world with high-end visuals.", price: "$39.99" },
        { title: "Shadow Protocol", tag: "Strategy", description: "Take command in a tactical sci-fi campaign.", price: "$24.99" },
        { title: "Nova Drift", tag: "Arcade", description: "A polished speedrunner with slick motion design.", price: "$19.99" },
      ],
    },
  ];

  return (
    <>
      <ContextMenu />
      <ModalFrame />

      <div class="relative h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(41,98,255,0.18),_transparent_25%),linear-gradient(180deg,_#06070b_0%,_#0b0f17_100%)]">
        <Show when={libraryData.userSettings.showSideBar === false && windowWidth() >= 1000}>
          <button
            type="button"
            class="fixed! tooltip-delayed-left card-hover top-8 right-7 z-20 w-[25.25px] cursor-pointer p-2 duration-150"
            onClick={() => {
              toggleSideBar();
            }}
            data-tooltip={translateText("sidebar.open")}
          >
            <ChevronArrows classProp="rotate-180" />
          </button>
        </Show>
        <Show when={libraryData.userSettings.showSideBar && windowWidth() >= 1000}>
          <div class="fixed top-0 left-0 z-10 w-[calc(10rem+10%)]">
            <SideBar />
          </div>
        </Show>
        <Show when={libraryData.folders.length === 0}>
          <div class="absolute flex h-screen flex-col items-center justify-center overflow-y-scroll py-5 pr-7.5">
            <div class="z-50!">
              <p class="subtle-text">
                {translateText("welcome.thank_you")}
                <br />
                <br />- {translateText("welcome.add_games")}
                <br />
                <br />- {translateText("welcome.create_folders")}
                <br />
                <br />- {translateText("welcome.check_settings")}
              </p>

              <div class="mt-8.5 flex gap-6">
                <button
                  type="button"
                  class="standardButton tooltip-bottom icon-btn w-max!"
                  data-tooltip={translateText("steam.import_warning")}
                  onClick={handleImportSteamGames}
                >
                  {translateText("steam.import")}
                  <Steam />
                </button>

                <LanguageSelector onSettingsPage={false} />
              </div>

              <Hotkeys onSettingsPage={false} />
            </div>
          </div>
        </Show>

        {/* seperating out pr and pl here and adding it back in the folder is because we want to fix the style for the tabbing */}
        <div
          class={`h-screen overflow-y-scroll rounded-none! py-5 pr-7 ${
            libraryData.userSettings.showSideBar && windowWidth() >= 1000 ? "pl-[calc(11.5rem+10%)]" : "pl-5"
          }`}
        >
          <div class="mx-auto max-w-7xl px-2 pb-10">
            <EpicHero />
            <CoreGamesEditor />
            <MarketplaceShell />
            <section class="mb-8 rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,_rgba(9,13,24,0.96),_rgba(12,19,35,0.96))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.4)]">
              <div class="max-w-3xl">
                <div class="mb-3 inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-200">
                  Spider Games Platform
                </div>
                <h2 class="text-3xl font-semibold text-white sm:text-4xl">A premium digital marketplace for creators, studios, and players</h2>
                <p class="mt-3 text-sm leading-7 text-slate-300 sm:text-base">
                  Spider Games is a modern gaming and digital asset ecosystem built for discovery, secure commerce, and high-quality creative collaboration. From premium 3D environments and character packs to audio tools and plugin libraries, the platform brings professional storefront experiences, strong licensing controls, and polished community features into one immersive launcher.
                </p>
              </div>
            </section>
            <ScreenshotShowcase title="Studio Highlights" subtitle="Immersive visuals and polished storefront experiences" items={[
              { title: "Hero Banner", tag: "Storefront", caption: "High-impact featured experience with cinematic artwork.", tint: "from-cyan-500/20 via-blue-500/10 to-violet-500/20" },
              { title: "Library View", tag: "Library", caption: "Clean downloads, updates, and secure access management.", tint: "from-fuchsia-500/20 via-purple-500/10 to-slate-900" },
              { title: "Creator Dashboard", tag: "Creators", caption: "Upload, verify, and monetize assets from one premium console.", tint: "from-blue-500/20 via-cyan-500/10 to-emerald-500/20" },
              { title: "Asset Preview", tag: "Preview", caption: "Rich gallery, product details, and licensing information.", tint: "from-violet-500/20 via-slate-800 to-cyan-500/20" },
              { title: "Secure Checkout", tag: "Commerce", caption: "Encrypted transactions, verified downloads, and instant access.", tint: "from-slate-800 via-slate-700 to-blue-500/20" },
            ]} />
            <ScreenshotShowcase title="Marketplace Pages" subtitle="Multiple curated pages for discovery, creators, cart, and library" items={[
              { title: "Discover", tag: "Explore", caption: "Curated categories, recommendations, and featured drops.", tint: "from-cyan-400/20 via-slate-900 to-blue-500/20" },
              { title: "Store", tag: "Browse", caption: "Premium cards, filters, tags, and category-driven discovery.", tint: "from-violet-400/20 via-slate-900 to-fuchsia-500/20" },
              { title: "Library", tag: "Owned", caption: "Download management, patches, and versioned updates.", tint: "from-slate-800 via-cyan-500/10 to-slate-900" },
              { title: "Creators", tag: "Studio", caption: "Analytics, approvals, revenue, and publishing workflows.", tint: "from-blue-500/20 via-violet-500/10 to-slate-900" },
              { title: "Cart", tag: "Checkout", caption: "Secure purchase flow for instant digital delivery.", tint: "from-fuchsia-500/20 via-blue-500/10 to-cyan-500/20" },
            ]} />
            <CreatorHub />
            <AssetDetail />
            <For each={featuredSections}>{(section) => <EpicSection title={section.title} subtitle={section.subtitle} items={section.items} />}</For>
          </div>

          <Show when={libraryData.folders && !search()}>
            <For each={libraryData.folders}>
              {(folder) => {
                return (
                  <Show when={folder.games.length !== 0 && !folder.hide}>
                    <div class="mb-10 pl-2">
                      <Show when={libraryData.userSettings.folderTitle}>
                        <h1 class="title">{folder.name}</h1>
                      </Show>
                      <div
                        class={`mt-4 grid gap-5 ${returnGridStyleForGameCard(
                          libraryData.userSettings.zoomLevel,
                          libraryData.userSettings.showSideBar,
                        )}`}
                      >
                        <GameCards gamesList={folder.games} />
                      </div>
                    </div>
                  </Show>
                );
              }}
            </For>
          </Show>

          <Show when={search()}>
            <div class="pl-2">
              <div
                class={`mt-4 grid gap-5 ${returnGridStyleForGameCard(
                  libraryData.userSettings.zoomLevel,
                  libraryData.userSettings.showSideBar,
                )}`}
              >
                <GameCards gamesList={searchResults()} />
              </div>
              <div class="items-center">
                <Show when={searchResults()?.length === 0}>
                  <div class="flex h-[calc(100vh-100px)] w-full items-center justify-center gap-3 align-middle">
                    <EmptyTray />
                    {translateText("search.no_games_found")}
                  </div>
                </Show>
              </div>
            </div>
          </Show>
        </div>
      </div>
      <Toast />
    </>
  );
}

export default App;
