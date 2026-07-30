#pragma once

#include <mutex>
#include <string>
#include <vector>

namespace spider_games::marketplace {

struct AssetRecord {
    std::string id;
    std::string title;
    std::string category;
    std::string price;
    std::string creator;
    int rating{0};
};

struct CreatorProfile {
    std::string id;
    std::string name;
    std::string specialty;
    int followers{0};
};

class MarketplaceCore {
public:
    MarketplaceCore();

    std::string get_featured_assets() const;
    std::string get_creator_profiles() const;
    std::string get_recommendations() const;
    std::string get_download_library() const;
    std::string get_security_status() const;

private:
    std::vector<AssetRecord> assets_;
    std::vector<CreatorProfile> creators_;
    mutable std::mutex mutex_;
};

}  // namespace spider_games::marketplace
