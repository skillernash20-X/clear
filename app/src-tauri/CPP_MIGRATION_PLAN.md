# C++ migration plan for Clear

## Current repository structure
- The desktop application is a Tauri-based launcher with a SolidJS frontend in [app](app).
- The Rust backend in [app/src-tauri](app/src-tauri) currently exposes a few small commands for opening files, reading Steam metadata, downloading images, and deleting assets.
- The app logic in [app/src](app/src) is organized around Solid stores, services, and modal components for a game library manager.
- The API layer in [api](api) is a lightweight Hono server used for metadata retrieval.

## Migration strategy
1. Preserve the existing Tauri host and SolidJS experience.
2. Introduce a dedicated C++20 platform core under [app/src-tauri/src/core](app/src-tauri/src/core) for accounts, library management, downloads, notifications, and catalog services.
3. Expose the core through a thin Rust bridge so the app can consume it without rewriting the frontend.
4. Add a focused test harness for the new core and verify that the Tauri build still succeeds.

## Files expected to change
- [app/src-tauri/Cargo.toml](app/src-tauri/Cargo.toml)
- [app/src-tauri/build.rs](app/src-tauri/build.rs)
- [app/src-tauri/src/main.rs](app/src-tauri/src/main.rs)
- [app/src-tauri/src/core/platform_core.hpp](app/src-tauri/src/core/platform_core.hpp)
- [app/src-tauri/src/core/platform_core.cpp](app/src-tauri/src/core/platform_core.cpp)
- [app/src-tauri/src/core/platform_core_test.cpp](app/src-tauri/src/core/platform_core_test.cpp)
- Optionally, [app/src/App.jsx](app/src/App.jsx) for a small launch-platform status panel.

## Risks
- The existing project is web-first, so a full UI rewrite would be too large for this pass.
- Tauri and the Rust toolchain must stay compatible with the current desktop build.
- C++ integration should stay narrow and low-risk by exposing a small ABI surface rather than replacing the full frontend stack.
