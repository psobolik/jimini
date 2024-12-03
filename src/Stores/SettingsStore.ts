import {BaseDirectory, createDir, exists, readTextFile, writeTextFile} from "@tauri-apps/api/fs";
import {appConfigDir} from "@tauri-apps/api/path";
import {Settings} from "../Data/Settings.ts";

export default class SettingsStore {
    public static read = async (): Promise<Settings> => {
        // Read and parse contents of `$APPCONFIG/settings.json`
        try {
            const contents = await readTextFile('settings.json', {dir: BaseDirectory.AppConfig});
            return JSON.parse(contents);
        } catch (e) {
            console.error(`read failure: ${e}`)
            return new Settings();
        }
    }
    public static write = async (settings: Settings) => {
        const dir = await appConfigDir();
        if (! await exists(dir)) {
            await createDir(dir, { recursive: true });
        }
        const json = JSON.stringify(settings);
        await writeTextFile(`${dir}settings.json`, json)
    }
}
