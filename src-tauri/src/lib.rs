use serde::Serialize;

#[derive(Serialize)]
pub struct PlatformInfo {
    pub os: &'static str,
    pub arch: &'static str,
    pub family: &'static str,
    pub debug: bool,
}

/// Returns a greeting; the canonical "the frontend reached Rust" check.
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

/// Reports which OS and CPU architecture the real shell is running on.
/// The E2E suite names its screenshots after this, so a run on
/// `macos-latest` and a run on `windows-11-arm` can never overwrite each other.
#[tauri::command]
fn platform_info() -> PlatformInfo {
    PlatformInfo {
        os: std::env::consts::OS,
        arch: std::env::consts::ARCH,
        family: std::env::consts::FAMILY,
        debug: cfg!(debug_assertions),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_wdio::init());

    // The embedded WebDriver server exists only in debug builds. Release
    // builds compile the crate but never start the server.
    #[cfg(debug_assertions)]
    let builder = builder.plugin(tauri_plugin_wdio_webdriver::init());

    builder
        .invoke_handler(tauri::generate_handler![greet, platform_info])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
