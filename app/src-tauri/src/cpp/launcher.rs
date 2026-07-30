use std::ffi::{CStr, CString};
use std::os::raw::c_char;

#[link(name = "launcher_core", kind = "static")]
extern "C" {
    fn launcher_register_account(email: *const c_char, password: *const c_char) -> *mut c_char;
    fn launcher_login(email: *const c_char, password: *const c_char) -> *mut c_char;
    fn launcher_get_profile() -> *mut c_char;
    fn launcher_get_store_catalog() -> *mut c_char;
    fn launcher_get_library() -> *mut c_char;
    fn launcher_get_notifications() -> *mut c_char;
    fn launcher_get_settings() -> *mut c_char;
    fn launcher_get_friends() -> *mut c_char;
    fn launcher_get_achievements() -> *mut c_char;
    fn launcher_get_cloud_saves() -> *mut c_char;
    fn launcher_publish_game(title: *const c_char, genre: *const c_char) -> *mut c_char;
    fn marketplace_get_featured_assets() -> *mut c_char;
    fn marketplace_get_creator_profiles() -> *mut c_char;
    fn marketplace_get_recommendations() -> *mut c_char;
    fn marketplace_get_download_library() -> *mut c_char;
    fn marketplace_get_security_status() -> *mut c_char;
}

pub struct LauncherCore;

impl LauncherCore {
    pub fn new() -> Self {
        Self
    }

    fn read_string(ptr: *mut c_char) -> String {
        if ptr.is_null() {
            return "{}".to_string();
        }
        unsafe {
            let c_str = CStr::from_ptr(ptr);
            let value = c_str.to_string_lossy().into_owned();
            let _ = CString::from_raw(ptr);
            value
        }
    }

    pub fn register_account(&self, email: String) -> String {
        let email_c = CString::new(email).unwrap();
        let password_c = CString::new("securepass").unwrap();
        unsafe {
            let raw = launcher_register_account(email_c.as_ptr(), password_c.as_ptr());
            Self::read_string(raw)
        }
    }

    pub fn login(&self, email: String) -> String {
        let email_c = CString::new(email).unwrap();
        let password_c = CString::new("securepass").unwrap();
        unsafe {
            let raw = launcher_login(email_c.as_ptr(), password_c.as_ptr());
            Self::read_string(raw)
        }
    }

    pub fn get_profile(&self) -> String {
        unsafe {
            let raw = launcher_get_profile();
            Self::read_string(raw)
        }
    }

    pub fn get_store_catalog(&self) -> String {
        unsafe {
            let raw = launcher_get_store_catalog();
            Self::read_string(raw)
        }
    }

    pub fn get_library(&self) -> String {
        unsafe {
            let raw = launcher_get_library();
            Self::read_string(raw)
        }
    }

    pub fn get_notifications(&self) -> String {
        unsafe {
            let raw = launcher_get_notifications();
            Self::read_string(raw)
        }
    }

    pub fn get_settings(&self) -> String {
        unsafe {
            let raw = launcher_get_settings();
            Self::read_string(raw)
        }
    }

    pub fn get_friends(&self) -> String {
        unsafe {
            let raw = launcher_get_friends();
            Self::read_string(raw)
        }
    }

    pub fn get_achievements(&self) -> String {
        unsafe {
            let raw = launcher_get_achievements();
            Self::read_string(raw)
        }
    }

    pub fn get_cloud_saves(&self) -> String {
        unsafe {
            let raw = launcher_get_cloud_saves();
            Self::read_string(raw)
        }
    }

    pub fn publish_game(&self, title: String, genre: String) -> String {
        let title_c = CString::new(title).unwrap();
        let genre_c = CString::new(genre).unwrap();
        unsafe {
            let raw = launcher_publish_game(title_c.as_ptr(), genre_c.as_ptr());
            Self::read_string(raw)
        }
    }

    pub fn get_marketplace_features(&self) -> String {
        unsafe {
            let raw = marketplace_get_featured_assets();
            Self::read_string(raw)
        }
    }

    pub fn get_marketplace_creators(&self) -> String {
        unsafe {
            let raw = marketplace_get_creator_profiles();
            Self::read_string(raw)
        }
    }

    pub fn get_marketplace_recommendations(&self) -> String {
        unsafe {
            let raw = marketplace_get_recommendations();
            Self::read_string(raw)
        }
    }

    pub fn get_download_library(&self) -> String {
        unsafe {
            let raw = marketplace_get_download_library();
            Self::read_string(raw)
        }
    }

    pub fn get_security_status(&self) -> String {
        unsafe {
            let raw = marketplace_get_security_status();
            Self::read_string(raw)
        }
    }
}
