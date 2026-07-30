#include "engine.hpp"

#include <iostream>

namespace spider_games::engine {

Engine::Engine(EngineConfig config) : config_(std::move(config)) {}

void Engine::initialize() {
    std::cout << "[Manticore Core] Initializing engine for " << config_.project_name << "\n";
    for (const auto& system : systems_) {
        system->initialize();
    }
}

void Engine::shutdown() {
    for (auto it = systems_.rbegin(); it != systems_.rend(); ++it) {
        (*it)->shutdown();
    }
    std::cout << "[Manticore Core] Shutting down engine\n";
}

const EngineConfig& Engine::config() const {
    return config_;
}

void Engine::register_system(std::shared_ptr<ISystem> system) {
    systems_.push_back(std::move(system));
}

std::vector<std::string> Engine::system_names() const {
    std::vector<std::string> names;
    names.reserve(systems_.size());
    for (const auto& system : systems_) {
        names.emplace_back(typeid(*system).name());
    }
    return names;
}

}  // namespace spider_games::engine
