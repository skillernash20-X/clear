#include "launcher.hpp"

#include <cstddef>
#include <cstring>
#include <string>

extern "C" {

char* launcher_register_account(const char* email, const char* password) {
    static spider_games::platform::LauncherCore core;
    std::string result = core.register_account(email ? email : "", password ? password : "");
    char* copy = static_cast<char*>(std::malloc(result.size() + 1));
    if (!copy) {
        return nullptr;
    }
    std::strcpy(copy, result.c_str());
    return copy;
}

char* launcher_login(const char* email, const char* password) {
    static spider_games::platform::LauncherCore core;
    std::string result = core.login(email ? email : "", password ? password : "");
    char* copy = static_cast<char*>(std::malloc(result.size() + 1));
    if (!copy) {
        return nullptr;
    }
    std::strcpy(copy, result.c_str());
    return copy;
}

char* launcher_get_profile() {
    static spider_games::platform::LauncherCore core;
    std::string result = core.get_profile();
    char* copy = static_cast<char*>(std::malloc(result.size() + 1));
    if (!copy) {
        return nullptr;
    }
    std::strcpy(copy, result.c_str());
    return copy;
}

char* launcher_get_store_catalog() {
    static spider_games::platform::LauncherCore core;
    std::string result = core.get_store_catalog();
    char* copy = static_cast<char*>(std::malloc(result.size() + 1));
    if (!copy) {
        return nullptr;
    }
    std::strcpy(copy, result.c_str());
    return copy;
}

char* launcher_get_library() {
    static spider_games::platform::LauncherCore core;
    std::string result = core.get_library();
    char* copy = static_cast<char*>(std::malloc(result.size() + 1));
    if (!copy) {
        return nullptr;
    }
    std::strcpy(copy, result.c_str());
    return copy;
}

char* launcher_get_notifications() {
    static spider_games::platform::LauncherCore core;
    std::string result = core.get_notifications();
    char* copy = static_cast<char*>(std::malloc(result.size() + 1));
    if (!copy) {
        return nullptr;
    }
    std::strcpy(copy, result.c_str());
    return copy;
}

char* launcher_get_settings() {
    static spider_games::platform::LauncherCore core;
    std::string result = core.get_settings();
    char* copy = static_cast<char*>(std::malloc(result.size() + 1));
    if (!copy) {
        return nullptr;
    }
    std::strcpy(copy, result.c_str());
    return copy;
}

char* launcher_get_friends() {
    static spider_games::platform::LauncherCore core;
    std::string result = core.get_friends();
    char* copy = static_cast<char*>(std::malloc(result.size() + 1));
    if (!copy) {
        return nullptr;
    }
    std::strcpy(copy, result.c_str());
    return copy;
}

char* launcher_get_achievements() {
    static spider_games::platform::LauncherCore core;
    std::string result = core.get_achievements();
    char* copy = static_cast<char*>(std::malloc(result.size() + 1));
    if (!copy) {
        return nullptr;
    }
    std::strcpy(copy, result.c_str());
    return copy;
}

char* launcher_get_cloud_saves() {
    static spider_games::platform::LauncherCore core;
    std::string result = core.get_cloud_saves();
    char* copy = static_cast<char*>(std::malloc(result.size() + 1));
    if (!copy) {
        return nullptr;
    }
    std::strcpy(copy, result.c_str());
    return copy;
}

char* launcher_publish_game(const char* title, const char* genre) {
    static spider_games::platform::LauncherCore core;
    std::string result = core.publish_game(title ? title : "", genre ? genre : "");
    char* copy = static_cast<char*>(std::malloc(result.size() + 1));
    if (!copy) {
        return nullptr;
    }
    std::strcpy(copy, result.c_str());
    return copy;
}

}  // extern "C"
