#pragma once

#include "engine.hpp"

#include <string>
#include <vector>

namespace spider_games::engine::editor {

struct Tool {
    std::string name;
    std::string category;
    std::string description;
};

struct EditorPanel {
    std::string name;
    std::string title;
    std::string description;
};

class Editor : public spider_games::engine::ISystem {
public:
    Editor();
    void initialize() override;
    void shutdown() override;
    void open_project(const std::string& project_path);
    std::vector<Tool> tools() const;
    std::vector<EditorPanel> panels() const;
    std::string current_project() const;
    void set_active_scene(const std::string& scene_name);
    std::string active_scene() const;

private:
    std::string project_path_;
    std::string active_scene_;
    std::vector<Tool> tools_;
    std::vector<EditorPanel> panels_;
};

}  // namespace spider_games::engine::editor
