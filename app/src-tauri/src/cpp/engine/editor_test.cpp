#include "engine.hpp"
#include "editor.hpp"

#include <iostream>
#include <memory>

int main() {
    spider_games::engine::EngineConfig config;
    spider_games::engine::Engine engine(config);

    auto editor = std::make_shared<spider_games::engine::editor::Editor>();
    editor->open_project("./projects/spider_games");
    engine.register_system(editor);
    engine.initialize();

    std::cout << "Editor tools available:" << std::endl;
    for (const auto& tool : editor->tools()) {
        std::cout << "- " << tool.name << " | " << tool.category << "\n";
    }

    std::cout << "Active project: " << editor->current_project() << std::endl;
    editor->set_active_scene("MainLevel");
    std::cout << "Active scene: " << editor->active_scene() << std::endl;

    engine.shutdown();
    return 0;
}
