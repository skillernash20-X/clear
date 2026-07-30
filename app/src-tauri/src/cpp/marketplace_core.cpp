#include "marketplace_core.hpp"

#include <sstream>

namespace spider_games::marketplace {

MarketplaceCore::MarketplaceCore() {
    assets_ = {
        {"asset-001", "Neon City Pack", "Environments", "$89", "Astra Forge", 98},
        {"asset-002", "Void Warrior Rig", "Characters", "$129", "Nova Studio", 96},
        {"asset-003", "Horizon Audio Suite", "Audio", "$49", "Zero Pulse", 94},
    };
    creators_ = {
        {"creator-001", "Astra Forge", "Environment Artist", 18200},
        {"creator-002", "Nova Studio", "Technical Artist", 8400},
        {"creator-003", "Zero Pulse", "Audio Designer", 6200},
    };
}

std::string MarketplaceCore::get_featured_assets() const {
    std::lock_guard<std::mutex> lock(mutex_);
    std::ostringstream oss;
    oss << "[";
    for (std::size_t i = 0; i < assets_.size(); ++i) {
        if (i) oss << ",";
        const auto& asset = assets_[i];
        oss << "{\"id\":\"" << asset.id << "\",\"title\":\"" << asset.title << "\",\"category\":\"" << asset.category << "\",\"price\":\"" << asset.price << "\",\"creator\":\"" << asset.creator << "\",\"rating\":" << asset.rating << "}";
    }
    oss << "]";
    return oss.str();
}

std::string MarketplaceCore::get_creator_profiles() const {
    std::lock_guard<std::mutex> lock(mutex_);
    std::ostringstream oss;
    oss << "[";
    for (std::size_t i = 0; i < creators_.size(); ++i) {
        if (i) oss << ",";
        const auto& creator = creators_[i];
        oss << "{\"id\":\"" << creator.id << "\",\"name\":\"" << creator.name << "\",\"specialty\":\"" << creator.specialty << "\",\"followers\":" << creator.followers << "}";
    }
    oss << "]";
    return oss.str();
}

std::string MarketplaceCore::get_recommendations() const {
    return R"({"recommendations":["AAA environments","Character rigs","Audio tools","Plugin packs"]})";
}

std::string MarketplaceCore::get_download_library() const {
    return R"({"downloads":[{"title":"Neon City Pack","status":"Ready"},{"title":"Lumen Material Pack","status":"Updating"}]})";
}

std::string MarketplaceCore::get_security_status() const {
    return R"({"security":"bank-grade","payments":"encrypted","licenses":"verified","updates":"automatic"})";
}

}  // namespace spider_games::marketplace
