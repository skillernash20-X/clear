const createId = () => {
  if (typeof globalThis.crypto !== "undefined" && typeof globalThis.crypto.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export function createSceneObject({ name, type = "Prop", x = 20, y = 20 }) {
  return {
    id: createId(),
    name,
    type,
    x,
    y,
  };
}

export function createProject({ name, genre = "Action", description = "" }) {
  const safeName = name?.trim() || "Untitled Game";

  return {
    id: createId(),
    name: safeName,
    genre,
    description,
    engine: "Manticore Core",
    status: "Prototype",
    progress: 30,
    scenes: [
      {
        id: createId(),
        name: "Start",
        type: "Gameplay",
        updatedAt: new Date().toISOString(),
        objects: [
          createSceneObject({ name: "Spawn Point", type: "Spawn", x: 18, y: 24 }),
          createSceneObject({ name: "Pickup", type: "Interactable", x: 62, y: 38 }),
        ],
      },
    ],
    assets: [
      {
        id: createId(),
        name: "Player Controller",
        type: "Blueprint",
      },
      {
        id: createId(),
        name: "HUD Overlay",
        type: "UI",
      },
    ],
  };
}

export function createScene(project, sceneName) {
  const nextScene = {
    id: createId(),
    name: sceneName.trim() || "New Scene",
    type: "Gameplay",
    updatedAt: new Date().toISOString(),
    objects: [createSceneObject({ name: "New Prop", type: "Prop", x: 32, y: 28 })],
  };

  return {
    ...project,
    scenes: [...project.scenes, nextScene],
    progress: Math.min(95, project.progress + 8),
  };
}

export function createInitialEditorState() {
  return {
    projects: [createProject({ name: "Neon Drift", genre: "Action", description: "A fast-paced arcade experience for the Spider Games storefront." })],
    selectedProjectId: null,
    selectedSceneId: null,
  };
}
