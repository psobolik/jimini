import {BaseDirectory, exists, createDir, readTextFile, writeTextFile} from "@tauri-apps/api/fs";
import {appConfigDir} from "@tauri-apps/api/path";

export enum ColorScheme {
    LIGHT,
    DARK,
    SYSTEM
}
export enum TextSize {
    SMALL,
    MEDIUM,
    LARGE
}
export class Settings {
    colorScheme: ColorScheme;
    homeUrlString: string;
    textSize: TextSize;

    constructor(colorScheme?: ColorScheme, homeUrlString?: string, textSize?: TextSize) {
        this.colorScheme = colorScheme ?? ColorScheme.SYSTEM;
        this.homeUrlString = homeUrlString ?? "";
        this.textSize = textSize ?? TextSize.MEDIUM;
    }
}
export class SettingsIO {
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
