import {createDir, exists, readTextFile, writeTextFile} from "@tauri-apps/api/fs";
import {appConfigDir, resolve} from "@tauri-apps/api/path";
import {Settings} from "../Data/Settings.ts";

export default class SettingsStore {
    static fileName = "settings.json";

    public static read = async (): Promise<Settings> => {
        const dir = await appConfigDir();
        const settingsFile = await resolve(dir, SettingsStore.fileName);
        try {
            const contents = await readTextFile(settingsFile);
            return JSON.parse(contents);
        } catch (e) {
            // No settings is not an error
            return new Settings();
        }
    }
    public static write = async (settings: Settings) => {
        const dir = await appConfigDir();
        if (!await exists(dir)) {
            await createDir(dir, {recursive: true});
        }
        const settingsFile = await resolve(dir, SettingsStore.fileName);
        const contents = JSON.stringify(settings);
        try {
            await writeTextFile(settingsFile, contents)
        } catch (e) {
            console.error(`write failure: ${e}`)
        }

    }
}
