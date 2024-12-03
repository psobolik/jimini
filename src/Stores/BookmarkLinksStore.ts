import Bookmark from "../Data/Bookmark.ts";
import {BaseDirectory, createDir, exists, readTextFile, writeTextFile} from "@tauri-apps/api/fs";
import {appLocalDataDir} from "@tauri-apps/api/path";

export default class BookmarkLinksStore {
    static fileName = "bookmarks.json";
    public static read = async (): Promise<Bookmark[]> => {
        try {
            const json = await readTextFile(BookmarkLinksStore.fileName, { dir: BaseDirectory.AppLocalData });
            return JSON.parse(json);
        } catch (e) {
            console.error(`read failure: ${e}`)
            return [];
        }
    }
    public static write = async (bookmarks: Bookmark[]) => {
        const dir = await appLocalDataDir();
        if (! await exists(dir)) {
            await createDir(dir, { recursive: true });
        }
        const json = JSON.stringify(bookmarks);
        try {
            await writeTextFile(`${dir}${BookmarkLinksStore.fileName}`, json);
        } catch (e) {
            console.error(`write failure: ${e}`)
        }
    }
}
