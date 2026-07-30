use std::path::PathBuf;
use std::process::Command;

fn main() {
    println!("cargo:rerun-if-changed=src/cpp");

    let manifest_dir = PathBuf::from(std::env::var("CARGO_MANIFEST_DIR").unwrap());
    let cpp_dir = manifest_dir.join("src/cpp");
    let archive_path = cpp_dir.join("liblauncher_core.a");

    let sources = [
        cpp_dir.join("launcher.cpp"),
        cpp_dir.join("launcher_c.cpp"),
        cpp_dir.join("security.cpp"),
    ];

    let mut object_files = Vec::new();
    for source in &sources {
        let object_path = cpp_dir.join(format!("{}.o", source.file_stem().unwrap().to_string_lossy()));
        let status = Command::new("g++")
            .args([
                "-std=c++20",
                "-c",
                source.to_string_lossy().as_ref(),
                "-I",
                cpp_dir.to_string_lossy().as_ref(),
                "-o",
                object_path.to_string_lossy().as_ref(),
            ])
            .status()
            .expect("failed to invoke g++ for launcher core");
        assert!(status.success(), "failed to compile launcher core with g++");
        object_files.push(object_path);
    }

    let archive_status = Command::new("ar")
        .args(["rcs", archive_path.to_string_lossy().as_ref()])
        .arg("--")
        .args(object_files.iter().map(|path| path.to_string_lossy().into_owned()))
        .status()
        .expect("failed to invoke ar for launcher core");
    assert!(archive_status.success(), "failed to archive launcher core" );

    println!("cargo:rustc-link-search=native={}", cpp_dir.display());
    println!("cargo:rustc-link-lib=static=launcher_core");
    tauri_build::build()
}
