#include "security.hpp"

#include <array>
#include <iomanip>
#include <openssl/evp.h>
#include <openssl/rand.h>
#include <openssl/sha.h>
#include <sstream>
#include <stdexcept>

namespace spider_games::platform {
namespace {

std::string random_bytes(std::size_t size) {
    std::array<unsigned char, 32> buffer{};
    if (size > buffer.size()) {
        throw std::runtime_error("requested random size too large");
    }
    if (RAND_bytes(buffer.data(), static_cast<int>(size)) != 1) {
        throw std::runtime_error("openssl random failed");
    }
    std::ostringstream oss;
    for (std::size_t i = 0; i < size; ++i) {
        oss << std::hex << std::setw(2) << std::setfill('0') << static_cast<int>(buffer[i]);
    }
    return oss.str();
}

}  // namespace

std::string SecurityManager::hex_encode(const unsigned char* data, std::size_t size) const {
    std::ostringstream oss;
    oss << std::hex << std::setfill('0');
    for (std::size_t i = 0; i < size; ++i) {
        oss << std::setw(2) << static_cast<unsigned int>(data[i]);
    }
    return oss.str();
}

std::string SecurityManager::hash_password(const std::string& password) const {
    unsigned char hash[SHA256_DIGEST_LENGTH];
    SHA256(reinterpret_cast<const unsigned char*>(password.data()), password.size(), hash);
    return "$sha256$" + hex_encode(hash, sizeof(hash));
}

bool SecurityManager::verify_password(const std::string& password, const std::string& stored_hash) const {
    if (stored_hash.rfind("$sha256$", 0) != 0) {
        return false;
    }
    return hash_password(password) == stored_hash;
}

std::string SecurityManager::generate_session_token() const {
    return "sess-" + random_bytes(16);
}

std::string SecurityManager::sign_payload(const std::string& payload) const {
    unsigned char digest[SHA256_DIGEST_LENGTH];
    SHA256(reinterpret_cast<const unsigned char*>(payload.data()), payload.size(), digest);
    return hex_encode(digest, sizeof(digest));
}

bool SecurityManager::verify_signature(const std::string& payload, const std::string& signature) const {
    return sign_payload(payload) == signature;
}

std::string SecurityManager::sanitize_input(const std::string& input) const {
    std::string sanitized;
    sanitized.reserve(input.size());
    for (char ch : input) {
        if (ch == '<' || ch == '>' || ch == '"' || ch == '\'') {
            continue;
        }
        sanitized.push_back(ch);
    }
    return sanitized;
}

}  // namespace spider_games::platform
