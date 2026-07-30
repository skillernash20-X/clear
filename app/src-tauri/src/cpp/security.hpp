#pragma once

#include <string>

namespace spider_games::platform {

class SecurityManager {
public:
    std::string hash_password(const std::string& password) const;
    bool verify_password(const std::string& password, const std::string& stored_hash) const;
    std::string generate_session_token() const;
    std::string sign_payload(const std::string& payload) const;
    bool verify_signature(const std::string& payload, const std::string& signature) const;
    std::string sanitize_input(const std::string& input) const;

private:
    std::string hex_encode(const unsigned char* data, std::size_t size) const;
};

}  // namespace spider_games::platform
