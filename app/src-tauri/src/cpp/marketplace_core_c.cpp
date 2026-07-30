#include "marketplace_core.hpp"

#include <cstdlib>
#include <cstring>
#include <string>

extern "C" {

char* marketplace_get_featured_assets() {
    static spider_games::marketplace::MarketplaceCore core;
    std::string result = core.get_featured_assets();
    char* copy = static_cast<char*>(std::malloc(result.size() + 1));
    if (!copy) return nullptr;
    std::strcpy(copy, result.c_str());
    return copy;
}

char* marketplace_get_creator_profiles() {
    static spider_games::marketplace::MarketplaceCore core;
    std::string result = core.get_creator_profiles();
    char* copy = static_cast<char*>(std::malloc(result.size() + 1));
    if (!copy) return nullptr;
    std::strcpy(copy, result.c_str());
    return copy;
}

char* marketplace_get_recommendations() {
    static spider_games::marketplace::MarketplaceCore core;
    std::string result = core.get_recommendations();
    char* copy = static_cast<char*>(std::malloc(result.size() + 1));
    if (!copy) return nullptr;
    std::strcpy(copy, result.c_str());
    return copy;
}

char* marketplace_get_download_library() {
    static spider_games::marketplace::MarketplaceCore core;
    std::string result = core.get_download_library();
    char* copy = static_cast<char*>(std::malloc(result.size() + 1));
    if (!copy) return nullptr;
    std::strcpy(copy, result.c_str());
    return copy;
}

char* marketplace_get_security_status() {
    static spider_games::marketplace::MarketplaceCore core;
    std::string result = core.get_security_status();
    char* copy = static_cast<char*>(std::malloc(result.size() + 1));
    if (!copy) return nullptr;
    std::strcpy(copy, result.c_str());
    return copy;
}

}  // extern "C"
