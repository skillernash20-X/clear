#include "launcher.hpp"

#include <algorithm>
#include <chrono>
#include <cstdlib>
#include <ctime>
#include <future>
#include <iomanip>
#include <sstream>
#include <thread>
#include <utility>

namespace spider_games::platform {

namespace {

std::string escape_json(const std::string& value) {
    std::string escaped;
    escaped.reserve(value.size());
    for (char ch : value) {
        if (ch == '"') {
            escaped += "\\\"";
        } else if (ch == '\\') {
            escaped += "\\\\";
        } else {
            escaped += ch;
        }
    }
    return escaped;
}

std::string make_profile_json(const Account& account) {
    std::ostringstream oss;
    oss << "{\"id\":\"" << escape_json(account.id) << "\",\"username\":\""
        << escape_json(account.username) << "\",\"email\":\""
        << escape_json(account.email) << "\",\"authenticated\":"
        << (account.authenticated ? "true" : "false") << "}";
    return oss.str();
}

std::string make_catalog_json(const std::vector<CatalogGame>& catalog) {
    std::ostringstream oss;
    oss << "[";
    for (std::size_t i = 0; i < catalog.size(); ++i) {
        if (i != 0) {
            oss << ",";
        }
        const auto& game = catalog[i];
        oss << "{\"id\":\"" << escape_json(game.id) << "\",\"title\":\""
            << escape_json(game.title) << "\",\"genre\":\""
            << escape_json(game.genre) << "\",\"price\":\""
            << escape_json(game.price) << "\",\"rating\":" << game.rating << "}";
    }
    oss << "]";
    return oss.str();
}

std::string make_library_json(const std::vector<LibraryGame>& library) {
    std::ostringstream oss;
    oss << "[";
    for (std::size_t i = 0; i < library.size(); ++i) {
        if (i != 0) {
            oss << ",";
        }
        const auto& game = library[i];
        oss << "{\"id\":\"" << escape_json(game.id) << "\",\"title\":\""
            << escape_json(game.title) << "\",\"status\":\""
            << escape_json(game.status) << "\"}";
    }
    oss << "]";
    return oss.str();
}

std::string make_notifications_json(const std::vector<NotificationItem>& notifications) {
    std::ostringstream oss;
    oss << "[";
    for (std::size_t i = 0; i < notifications.size(); ++i) {
        if (i != 0) {
            oss << ",";
        }
        const auto& item = notifications[i];
        oss << "{\"id\":\"" << escape_json(item.id) << "\",\"message\":\""
            << escape_json(item.message) << "\"}";
    }
    oss << "]";
    return oss.str();
}

std::string make_friends_json(const std::vector<FriendPresence>& friends) {
    std::ostringstream oss;
    oss << "[";
    for (std::size_t i = 0; i < friends.size(); ++i) {
        if (i != 0) {
            oss << ",";
        }
        const auto& friend_item = friends[i];
        oss << "{\"id\":\"" << escape_json(friend_item.id) << "\",\"username\":\""
            << escape_json(friend_item.username) << "\",\"status\":\""
            << escape_json(friend_item.status) << "\"}";
    }
    oss << "]";
    return oss.str();
}

std::string make_achievements_json(const std::vector<Achievement>& achievements) {
    std::ostringstream oss;
    oss << "[";
    for (std::size_t i = 0; i < achievements.size(); ++i) {
        if (i != 0) {
            oss << ",";
        }
        const auto& achievement = achievements[i];
        oss << "{\"id\":\"" << escape_json(achievement.id) << "\",\"name\":\""
            << escape_json(achievement.name) << "\",\"progress\":" << achievement.progress << "}";
    }
    oss << "]";
    return oss.str();
}

std::string make_cloud_saves_json(const std::vector<CloudSave>& saves) {
    std::ostringstream oss;
    oss << "[";
    for (std::size_t i = 0; i < saves.size(); ++i) {
        if (i != 0) {
            oss << ",";
        }
        const auto& save = saves[i];
        oss << "{\"gameId\":\"" << escape_json(save.game_id) << "\",\"slot\":\""
            << escape_json(save.slot) << "\",\"checksum\":\""
            << escape_json(save.checksum) << "\"}";
    }
    oss << "]";
    return oss.str();
}

}  // namespace

std::string current_timestamp() {
    auto now = std::chrono::system_clock::now();
    auto time = std::chrono::system_clock::to_time_t(now);
    std::ostringstream oss;
    oss << std::put_time(std::localtime(&time), "%Y-%m-%dT%H:%M:%S");
    return oss.str();
}

LauncherCore::LauncherCore() {
    catalog_ = {
        {"game-001", "Neon Rift", "Action", "$59.99", 94},
        {"game-002", "Starfall Legends", "RPG", "$49.99", 91},
        {"game-003", "Volt Arena", "Multiplayer", "$29.99", 88},
    };
    library_ = {
        {"game-001", "Neon Rift", "Installed"},
    };
    notifications_ = {
        {"notif-001", "New patch available for Neon Rift"},
    };
    friends_ = {
        {"friend-001", "Aster", "In Party"},
    };
    achievements_ = {
        {"ach-001", "First Steps", 100},
    };
    cloud_saves_ = {
        {"game-001", "slot-1", "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},
    };
    settings_ = "{\"theme\":\"dark\",\"autoUpdate\":true,\"cloudSync\":true,\"secureLogin\":true,\"twoFactor\":true}";
}

std::string LauncherCore::register_account(const std::string& email, const std::string& password) {
    std::lock_guard<std::mutex> lock(mutex_);
    if (email.empty() || password.size() < 8) {
        return "{\"status\":\"error\",\"message\":\"Invalid credentials\"}";
    }

    account_.id = "user-001";
    account_.username = email.substr(0, email.find('@'));
    account_.email = email;
    account_.authenticated = true;
    create_secure_session(email);
    return "{\"status\":\"ok\",\"profile\":" + make_profile_json(account_) + ",\"session\":{\"token\":\"" + escape_json(session_.token) + "\",\"fingerprint\":\"" + escape_json(session_.fingerprint) + "\"}}";
}

std::string LauncherCore::login(const std::string& email, const std::string& password) {
    std::lock_guard<std::mutex> lock(mutex_);
    if (email.empty() || password.empty()) {
        return "{\"status\":\"error\",\"message\":\"Missing credentials\"}";
    }

    account_.id = "user-001";
    account_.username = email.substr(0, email.find('@'));
    account_.email = email;
    account_.authenticated = true;
    create_secure_session(email);
    return "{\"status\":\"ok\",\"profile\":" + make_profile_json(account_) + ",\"session\":{\"token\":\"" + escape_json(session_.token) + "\",\"fingerprint\":\"" + escape_json(session_.fingerprint) + "\"}}";
}

std::string LauncherCore::get_profile() const {
    std::lock_guard<std::mutex> lock(mutex_);
    return make_profile_json(account_);
}

std::string LauncherCore::get_store_catalog() const {
    std::lock_guard<std::mutex> lock(mutex_);
    return make_catalog_json(catalog_);
}

std::string LauncherCore::get_library() const {
    std::lock_guard<std::mutex> lock(mutex_);
    return make_library_json(library_);
}

std::string LauncherCore::get_notifications() const {
    std::lock_guard<std::mutex> lock(mutex_);
    return make_notifications_json(notifications_);
}

std::string LauncherCore::get_settings() const {
    std::lock_guard<std::mutex> lock(mutex_);
    return settings_;
}

std::string LauncherCore::install_game(const std::string& game_id) {
    std::lock_guard<std::mutex> lock(mutex_);
    auto it = std::find_if(library_.begin(), library_.end(), [&](const LibraryGame& game) {
        return game.id == game_id;
    });

    if (it != library_.end()) {
        it->status = "Installing";
    }

    auto install_task = std::async(std::launch::async, [this, game_id]() {
        std::this_thread::sleep_for(std::chrono::milliseconds(50));
        std::lock_guard<std::mutex> local_lock(mutex_);
        auto it2 = std::find_if(library_.begin(), library_.end(), [&](const LibraryGame& game) {
            return game.id == game_id;
        });
        if (it2 != library_.end()) {
            it2->status = "Ready";
        }
    });
    install_task.wait();

    return "{\"status\":\"ok\",\"gameId\":\"" + game_id + "\",\"message\":\"Installation complete\"}";
}

std::string LauncherCore::update_game(const std::string& game_id) {
    std::lock_guard<std::mutex> lock(mutex_);
    return "{\"status\":\"ok\",\"gameId\":\"" + game_id + "\",\"message\":\"Update completed with patch management\"}";
}

std::string LauncherCore::create_review(const std::string& game_id, int rating, const std::string& text) {
    std::lock_guard<std::mutex> lock(mutex_);
    const auto sanitized_text = security_.sanitize_input(text);
    std::ostringstream oss;
    oss << "{\"status\":\"ok\",\"gameId\":\"" << escape_json(game_id) << "\",\"rating\":" << rating
        << ",\"review\":\"" << escape_json(sanitized_text) << "\"}";
    return oss.str();
}

std::string LauncherCore::create_secure_session(const std::string& email) {
    const auto token = security_.generate_session_token();
    session_.token = token;
    session_.fingerprint = security_.sign_payload(email);
    session_.issued_at = current_timestamp();
    return session_.token;
}

std::string LauncherCore::hash_password(const std::string& password) const {
    return security_.hash_password(password);
}

std::string LauncherCore::sign_payload(const std::string& payload) const {
    return security_.sign_payload(payload);
}

std::string LauncherCore::get_security_status() const {
    std::lock_guard<std::mutex> lock(mutex_);
    std::ostringstream oss;
    oss << "{\"status\":\"secure\",\"sessionActive\":" << (session_.token.empty() ? "false" : "true")
        << ",\"signature\":\"" << escape_json(sign_payload("launcher-security")) << "\"}";
    return oss.str();
}

std::string LauncherCore::get_friends() const {
    std::lock_guard<std::mutex> lock(mutex_);
    return make_friends_json(friends_);
}

std::string LauncherCore::get_achievements() const {
    std::lock_guard<std::mutex> lock(mutex_);
    return make_achievements_json(achievements_);
}

std::string LauncherCore::get_cloud_saves() const {
    std::lock_guard<std::mutex> lock(mutex_);
    return make_cloud_saves_json(cloud_saves_);
}

std::string LauncherCore::publish_game(const std::string& title, const std::string& genre) const {
    std::lock_guard<std::mutex> lock(mutex_);
    const auto safe_title = security_.sanitize_input(title);
    const auto safe_genre = security_.sanitize_input(genre);
    const auto token = security_.generate_session_token();
    std::ostringstream oss;
    oss << "{\"status\":\"ok\",\"title\":\"" << escape_json(safe_title) << "\",\"genre\":\""
        << escape_json(safe_genre) << "\",\"sessionToken\":\"" << escape_json(token) << "\"}";
    return oss.str();
}

}  // namespace spider_games::platform
