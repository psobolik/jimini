import {BaseDirectory, readTextFile, writeTextFile} from "@tauri-apps/api/fs";
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
        const json = JSON.stringify(settings);
        await writeTextFile(`${dir}settings.json`, json)
    }
    // I don't know why the following doesn't work, but it
    // says, "path not allowed on the configured scope: settings.json".
    // Calling readTextFile as above has no problems, and I am specifying
    // both readFile and writeFile permissions in tauri.conf.json.
    // public static write = async () => {
    //     const settings = JSON.stringify(this);
    //     await writeTextFile('settings.json', settings, { dir: BaseDirectory.AppConfig })
    // }
}
