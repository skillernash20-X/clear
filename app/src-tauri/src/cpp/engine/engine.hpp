#pragma once

#include <memory>
#include <string>
#include <vector>

namespace spider_games::engine {

struct EngineConfig {
    std::string project_name{"Spider Games"};
    std::string engine_name{"Manticore Core"};
    std::string target_platform{"Windows"};
};

class ISystem {
public:
    virtual ~ISystem() = default;
    virtual void initialize() = 0;
    virtual void shutdown() = 0;
};

class Engine {
public:
    explicit Engine(EngineConfig config);
    void initialize();
    void shutdown();
    const EngineConfig& config() const;
    void register_system(std::shared_ptr<ISystem> system);
    std::vector<std::string> system_names() const;

private:
    EngineConfig config_;
    std::vector<std::shared_ptr<ISystem>> systems_;
};

}  // namespace spider_games::engine
