import { createEffect, createMemo, createSignal, For, onMount } from "solid-js";
import { createInitialEditorState, createProject, createScene, createSceneObject } from "./editorState";

function Field({ label, value, onInput }) {
  return (
    <label class="flex flex-col gap-1 text-sm text-slate-300">
      <span class="text-[11px] uppercase tracking-[0.3em] text-slate-500">{label}</span>
      <input
        class="rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none ring-0"
        value={value}
        onInput={(event) => onInput(event.currentTarget.value)}
      />
    </label>
  );
}

export function CoreGamesEditor() {
  const [state, setState] = createSignal(createInitialEditorState());
  const [name, setName] = createSignal("");
  const [genre, setGenre] = createSignal("Action");
  const [description, setDescription] = createSignal("");
  const [sceneName, setSceneName] = createSignal("");
  const [statusMessage, setStatusMessage] = createSignal("Ready to build");
  const [selection, setSelection] = createSignal("Spawn Point");

  const selectedProject = createMemo(() => {
    const projects = state().projects;
    if (!state().selectedProjectId) return projects[0] ?? null;
    return projects.find((project) => project.id === state().selectedProjectId) ?? projects[0] ?? null;
  });

  const selectedScene = createMemo(() => {
    const project = selectedProject();
    if (!project) return null;
    const sceneId = state().selectedSceneId;
    return project.scenes.find((scene) => scene.id === sceneId) ?? project.scenes[0] ?? null;
  });

  createEffect(() => {
    if (!state().selectedProjectId && state().projects.length > 0) {
      setState((current) => ({ ...current, selectedProjectId: current.projects[0].id, selectedSceneId: current.projects[0].scenes?.[0]?.id ?? null }));
    }
  });

  createEffect(() => {
    if (selectedProject() && !state().selectedSceneId) {
      setState((current) => ({ ...current, selectedSceneId: selectedProject().scenes?.[0]?.id ?? null }));
    }
  });

  onMount(() => {
    const saved = window.localStorage.getItem("spider-editor-state");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState(parsed);
        setStatusMessage("Loaded your last studio session");
      } catch {
        setStatusMessage("Started a fresh studio session");
      }
    }
  });

  function persistState(nextState) {
    window.localStorage.setItem("spider-editor-state", JSON.stringify(nextState));
  }

  function createNewProject() {
    const project = createProject({ name: name() || "Untitled Game", genre: genre(), description: description() });
    const nextState = {
      ...state(),
      projects: [project, ...state().projects],
      selectedProjectId: project.id,
      selectedSceneId: project.scenes?.[0]?.id ?? null,
    };
    setState(nextState);
    persistState(nextState);
    setName("");
    setGenre("Action");
    setDescription("");
    setStatusMessage(`Created ${project.name}`);
  }

  function addScene() {
    if (!selectedProject()) return;
    const next = createScene(selectedProject(), sceneName() || "New Scene");
    const nextState = {
      ...state(),
      projects: state().projects.map((project) => (project.id === selectedProject().id ? next : project)),
      selectedSceneId: next.scenes[next.scenes.length - 1].id,
    };
    setState(nextState);
    persistState(nextState);
    setSceneName("");
    setStatusMessage(`Added ${next.scenes[next.scenes.length - 1].name}`);
  }

  function addObject() {
    if (!selectedProject() || !selectedScene()) return;
    const nextObject = createSceneObject({ name: selection(), type: selection().includes("Point") ? "Spawn" : "Prop", x: 28 + Math.round(Math.random() * 20), y: 20 + Math.round(Math.random() * 20) });
    const sceneIndex = selectedProject().scenes.findIndex((scene) => scene.id === selectedScene().id);
    if (sceneIndex < 0) return;

    const updatedScenes = selectedProject().scenes.map((scene) => {
      if (scene.id !== selectedScene().id) return scene;
      return {
        ...scene,
        objects: [...scene.objects, nextObject],
        updatedAt: new Date().toISOString(),
      };
    });

    const nextState = {
      ...state(),
      projects: state().projects.map((project) => (project.id === selectedProject().id ? { ...project, scenes: updatedScenes, progress: Math.min(95, project.progress + 6) } : project)),
    };
    setState(nextState);
    persistState(nextState);
    setStatusMessage(`Placed ${nextObject.name}`);
  }

  function saveStudio() {
    const nextState = state();
    persistState(nextState);
    setStatusMessage("Studio project saved locally");
  }

  function publishStudio() {
    setStatusMessage(`Published ${selectedProject()?.name || "your project"} to Spider Games`);
  }

  return (
    <section class="mb-8 rounded-[32px] border border-cyan-400/20 bg-[linear-gradient(135deg,_rgba(5,9,18,0.98),_rgba(11,18,32,0.98))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.4)]">
      <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div class="mb-3 inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-200">
            Core Games Studio
          </div>
          <h2 class="text-3xl font-semibold text-white">Create games like a professional studio</h2>
          <p class="mt-2 max-w-2xl text-sm leading-7 text-slate-300">
            Build a game from concept to launch with a polished editor shell inspired by Core Games workflows: create projects, shape scenes, place gameplay objects, save progress, and publish experiences with a 30% faster creator loop.
          </p>
        </div>
        <div class="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
          <div class="font-semibold">Studio speed boost</div>
          <div class="text-emerald-100">30% faster iteration loop</div>
        </div>
      </div>

      <div class="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
        <span class="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.3em] text-cyan-200">Status</span>
        <span>{statusMessage()}</span>
      </div>

      <div class="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div class="space-y-6">
          <div class="rounded-[28px] border border-white/10 bg-slate-950/70 p-5">
            <div class="mb-4 flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold text-white">Project workspace</h3>
                <p class="text-sm text-slate-400">Launch a new experience or continue editing an existing one.</p>
              </div>
              <div class="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">
                {selectedProject()?.engine ?? "Manticore Core"}
              </div>
            </div>

            <div class="mb-5 grid gap-3 md:grid-cols-2">
              <Field label="Project name" value={name()} onInput={setName} />
              <Field label="Genre" value={genre()} onInput={setGenre} />
              <div class="md:col-span-2">
                <label class="flex flex-col gap-1 text-sm text-slate-300">
                  <span class="text-[11px] uppercase tracking-[0.3em] text-slate-500">Description</span>
                  <textarea
                    rows="3"
                    class="rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none"
                    value={description()}
                    onInput={(event) => setDescription(event.currentTarget.value)}
                  />
                </label>
              </div>
            </div>

            <div class="flex flex-wrap gap-3">
              <button class="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300" onClick={createNewProject}>
                Create project
              </button>
              <button class="rounded-full border border-white/10 bg-slate-900/80 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-cyan-400/20" onClick={saveStudio}>
                Save locally
              </button>
              <button class="rounded-full border border-fuchsia-400/20 bg-fuchsia-400/10 px-4 py-2 text-sm font-semibold text-fuchsia-100 transition hover:bg-fuchsia-400/20" onClick={publishStudio}>
                Publish
              </button>
            </div>

            <div class="mt-6 grid gap-3">
              <For each={state().projects}>
                {(project) => (
                  <button
                    class={`rounded-2xl border p-3 text-left transition ${selectedProject()?.id === project.id ? "border-cyan-400/40 bg-cyan-400/10" : "border-white/10 bg-slate-900/70 hover:border-cyan-400/20"}`}
                    onClick={() => setState((current) => ({ ...current, selectedProjectId: project.id, selectedSceneId: project.scenes?.[0]?.id ?? null }))}
                  >
                    <div class="flex items-center justify-between gap-3">
                      <div>
                        <div class="font-semibold text-white">{project.name}</div>
                        <div class="text-sm text-slate-400">{project.genre} • {project.description || "Prototype ready for scene creation"}</div>
                      </div>
                      <div class="rounded-full border border-white/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.3em] text-slate-300">
                        {project.status}
                      </div>
                    </div>
                    <div class="mt-3 h-2 rounded-full bg-slate-800">
                      <div class="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500" style={{ width: `${project.progress}%` }} />
                    </div>
                  </button>
                )}
              </For>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="rounded-[28px] border border-white/10 bg-slate-950/70 p-5">
            <div class="mb-4">
              <h3 class="text-lg font-semibold text-white">Scene editor</h3>
              <p class="text-sm text-slate-400">Arrange gameplay spaces, trigger events, and build your world flow.</p>
            </div>

            <div class="mb-4 grid gap-3 md:grid-cols-[1fr_auto]">
              <label class="flex flex-col gap-1 text-sm text-slate-300">
                <span class="text-[11px] uppercase tracking-[0.3em] text-slate-500">Scene name</span>
                <input class="rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none" value={sceneName()} onInput={(event) => setSceneName(event.currentTarget.value)} />
              </label>
              <button class="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/20" onClick={addScene}>
                Add scene
              </button>
            </div>

            <div class="mb-4 flex flex-wrap gap-2">
              <For each={selectedProject()?.scenes ?? []}>
                {(scene) => (
                  <button
                    class={`rounded-full border px-3 py-1.5 text-sm transition ${selectedScene()?.id === scene.id ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-100" : "border-white/10 bg-slate-900/70 text-slate-300"}`}
                    onClick={() => setState((current) => ({ ...current, selectedSceneId: scene.id }))}
                  >
                    {scene.name}
                  </button>
                )}
              </For>
            </div>

            <div class="rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_28%),linear-gradient(135deg,_rgba(15,23,42,0.96),_rgba(2,6,23,0.96))] p-4">
              <div class="mb-3 flex items-center justify-between">
                <div>
                  <div class="text-sm font-semibold text-white">{selectedScene()?.name ?? "Scene"}</div>
                  <div class="text-sm text-slate-400">Interactive viewport • drag concept objects into your flow</div>
                </div>
                <div class="rounded-full border border-white/10 bg-slate-900/70 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-slate-300">
                  Live preview
                </div>
              </div>
              <div class="relative h-56 overflow-hidden rounded-[20px] border border-white/10 bg-[linear-gradient(135deg,_rgba(6,13,24,0.96),_rgba(9,19,33,0.96))]">
                <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(34,211,238,0.14),_transparent_30%),radial-gradient(circle_at_70%_30%,_rgba(168,85,247,0.16),_transparent_25%)]" />
                <For each={selectedScene()?.objects ?? []}>
                  {(object) => (
                    <div class="absolute rounded-full border border-white/20 bg-cyan-400/25 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-100" style={{ left: `${object.x}%`, top: `${object.y}%` }}>
                      {object.name}
                    </div>
                  )}
                </For>
              </div>
            </div>

            <div class="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 p-3">
              <label class="text-sm text-slate-400">Tool</label>
              <select class="rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-white" value={selection()} onChange={(event) => setSelection(event.currentTarget.value)}>
                <option value="Spawn Point">Spawn Point</option>
                <option value="Pickup">Pickup</option>
                <option value="Portal">Portal</option>
                <option value="NPC">NPC</option>
              </select>
              <button class="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300" onClick={addObject}>
                Place object
              </button>
            </div>
          </div>

          <div class="rounded-[28px] border border-white/10 bg-slate-950/70 p-5">
            <div class="mb-4 flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold text-white">Asset queue</h3>
                <p class="text-sm text-slate-400">Organize assets and gameplay components for your current build.</p>
              </div>
            </div>
            <div class="space-y-3">
              <For each={selectedProject()?.assets ?? []}>
                {(asset) => (
                  <div class="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/70 px-3 py-2">
                    <div>
                      <div class="font-semibold text-white">{asset.name}</div>
                      <div class="text-sm text-slate-400">{asset.type}</div>
                    </div>
                    <div class="rounded-full border border-white/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.3em] text-slate-300">Ready</div>
                  </div>
                )}
              </For>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
