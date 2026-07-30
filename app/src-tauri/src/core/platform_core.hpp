#pragma once

#include <cstdint>
#include <map>
#include <memory>
#include <string>
#include <vector>

namespace clear::platform {

struct UserProfile {
    std::string id;
    std::string username;
    std::string displayName;
    std::string email;
    std::string avatarUrl;
    bool isVerified{false};
};

struct GameCatalogEntry {
    std::string id;
    std::string title;
    std::string publisher;
    std::string description;
    std::string category;
    std::string thumbnailUrl;
    std::string releaseDate;
};

struct DownloadItem {
    std::string id;
    std::string gameId;
    std::string title;
    std::uint64_t bytesDownloaded{0};
    std::uint64_t totalBytes{0};
    bool completed{false};
};

class PlatformCore {
public:
    PlatformCore();

    [[nodiscard]] std::string healthCheck() const;

    [[nodiscard]] bool registerUser(const std::string& username, const std::string& password, const std::string& email);
    [[nodiscard]] bool loginUser(const std::string& username, const std::string& password);
    [[nodiscard]] std::string currentUserId() const;
    [[nodiscard]] UserProfile currentUserProfile() const;

    [[nodiscard]] std::vector<GameCatalogEntry> featuredGames() const;
    [[nodiscard]] std::vector<GameCatalogEntry> searchCatalog(const std::string& query) const;
    [[nodiscard]] std::vector<std::string> categories() const;

    void addToLibrary(const std::string& gameId);
    [[nodiscard]] bool hasGameInLibrary(const std::string& gameId) const;

    void enqueueDownload(const std::string& gameId, const std::string& title);
    [[nodiscard]] std::vector<DownloadItem> downloads() const;
    void markDownloadComplete(const std::string& gameId);

    void addNotification(const std::string& title, const std::string& body);
    [[nodiscard]] std::vector<std::pair<std::string, std::string>> notifications() const;

private:
    std::string currentUser_;
    std::map<std::string, UserProfile> users_;
    std::map<std::string, std::string> credentials_;
    std::vector<std::string> libraryIds_;
    std::map<std::string, DownloadItem> downloads_;
    std::vector<std::pair<std::string, std::string>> notifications_;
    std::vector<GameCatalogEntry> catalog_;
};

using PlatformCorePtr = std::shared_ptr<PlatformCore>;

} // namespace clear::platform
