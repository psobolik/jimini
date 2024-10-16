// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use base64::Engine;
use gemini_lib::response::GeminiResponse;

#[tauri::command]
async fn open_detached(path: String) -> Result<(), String> {
    match open::that_detached(path) {
        Ok(_) => Ok(()),
        Err(error) => Err(error.to_string()),
    }
}

#[tauri::command]
fn base64_encode(bytes: Vec<u8>) -> String {
    base64::engine::general_purpose::STANDARD.encode(&bytes)
}

#[tauri::command]
fn make_gemini_request(url: url::Url) -> Result<GeminiResponse, String> {
    match gemini_lib::make_request(url) {
        Ok(response) => Ok(response),
        Err(error) => Err(error.to_string()),
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            make_gemini_request,
            base64_encode,
            open_detached
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
