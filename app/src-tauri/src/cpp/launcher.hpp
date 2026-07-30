#pragma once

#include <mutex>
#include <string>
#include <vector>

#include <openssl/evp.h>
#include <openssl/sha.h>

#include "security.hpp"

namespace spider_games::platform {

struct Account {
    std::string id;
    std::string username;
    std::string email;
    bool authenticated{false};
};

struct CatalogGame {
    std::string id;
    std::string title;
    std::string genre;
    std::string price;
    int rating{0};
};

struct LibraryGame {
    std::string id;
    std::string title;
    std::string status;
};

struct NotificationItem {
    std::string id;
    std::string message;
};

struct FriendPresence {
    std::string id;
    std::string username;
    std::string status;
};

struct Achievement {
    std::string id;
    std::string name;
    int progress{0};
};

struct CloudSave {
    std::string game_id;
    std::string slot;
    std::string checksum;
};

struct SecuritySession {
    std::string token;
    std::string fingerprint;
    std::string issued_at;
};

class LauncherCore {
public:
    LauncherCore();

    std::string register_account(const std::string& email, const std::string& password);
    std::string login(const std::string& email, const std::string& password);
    std::string get_profile() const;
    std::string get_store_catalog() const;
    std::string get_library() const;
    std::string get_notifications() const;
    std::string get_settings() const;
    std::string install_game(const std::string& game_id);
    std::string update_game(const std::string& game_id);
    std::string create_review(const std::string& game_id, int rating, const std::string& text);
    std::string get_friends() const;
    std::string get_achievements() const;
    std::string get_cloud_saves() const;
    std::string publish_game(const std::string& title, const std::string& genre) const;
    std::string create_secure_session(const std::string& email);
    std::string hash_password(const std::string& password) const;
    std::string sign_payload(const std::string& payload) const;
    std::string get_security_status() const;

private:
    Account account_;
    std::vector<CatalogGame> catalog_;
    std::vector<LibraryGame> library_;
    std::vector<NotificationItem> notifications_;
    std::vector<FriendPresence> friends_;
    std::vector<Achievement> achievements_;
    std::vector<CloudSave> cloud_saves_;
    std::string settings_;
    SecuritySession session_;
    mutable std::mutex mutex_;
    SecurityManager security_;
};

}  // namespace spider_games::platform
