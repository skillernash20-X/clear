#include "editor.hpp"

#include <utility>

namespace spider_games::engine::editor {

Editor::Editor() {
    tools_ = {
        {"Scene View", "Viewport", "Inspect and edit levels in a real-time 3D scene view."},
        {"Asset Browser", "Content", "Browse models, textures, audio, and gameplay assets."},
        {"Property Inspector", "Tools", "Modify entity and component values with precision."},
        {"Console", "Debug", "Issue commands and inspect engine runtime state."},
        {"Profiler", "Performance", "Measure frame time, memory, and GPU cost."},
    };

    panels_ = {
        {"viewport", "Viewport", "Realtime scene editing surface."},
        {"asset_browser", "Asset Browser", "Content discovery and streaming view."},
        {"inspector", "Inspector", "Property editing and component introspection."},
    };
}

void Editor::initialize() {
    project_path_ = "./projects/spider_games";
    active_scene_ = "MainLevel";
}

void Editor::shutdown() {
    active_scene_.clear();
}

void Editor::open_project(const std::string& project_path) {
    project_path_ = project_path;
}

std::vector<Tool> Editor::tools() const {
    return tools_;
}

std::vector<EditorPanel> Editor::panels() const {
    return panels_;
}

std::string Editor::current_project() const {
    return project_path_;
}

void Editor::set_active_scene(const std::string& scene_name) {
    active_scene_ = scene_name;
}

std::string Editor::active_scene() const {
    return active_scene_;
}

}  // namespace spider_games::engine::editor
