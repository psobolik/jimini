import {invoke} from "@tauri-apps/api/core";
import GeminiResponse from "./Data/GeminiResponse.ts";

export default class Tauri {
    static makeGeminiRequest = (url: URL): Promise<GeminiResponse> => {
        return invoke("make_gemini_request", {url: url});
    }
    static base64_encode = (bytes: number[] | undefined): Promise<string> => {
        return invoke("base64_encode", {bytes: bytes});
    }
    static open_detached = (path: string): Promise<void> => {
        return invoke("open_detached", {path: path});
    }
    static version = (): Promise<string> => {
        return invoke("version");
    }
}
