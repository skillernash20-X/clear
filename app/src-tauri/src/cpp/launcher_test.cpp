#include "launcher.hpp"

#include <iostream>
#include <stdexcept>
#include <string>

namespace {

void require(bool condition, const std::string& message) {
    if (!condition) {
        throw std::runtime_error(message);
    }
}

}  // namespace

int main() {
    spider_games::platform::LauncherCore core;
    const auto registered = core.register_account("player@example.com", "securepass");
    const auto profile = core.get_profile();
    const auto catalog = core.get_store_catalog();
    const auto installed = core.install_game("game-001");
    const auto security = core.get_security_status();

    require(registered.find("\"status\":\"ok\"") != std::string::npos, "registration should succeed");
    require(profile.find("\"authenticated\":true") != std::string::npos, "profile should be authenticated");
    require(catalog.find("Neon Rift") != std::string::npos, "catalog should contain featured titles");
    require(installed.find("Installation complete") != std::string::npos, "installation should complete");
    require(security.find("\"status\":\"secure\"") != std::string::npos, "security status should be secure");

    std::cout << registered << "\n";
    std::cout << profile << "\n";
    std::cout << catalog << "\n";
    std::cout << installed << "\n";
    std::cout << security << "\n";
    return 0;
}
