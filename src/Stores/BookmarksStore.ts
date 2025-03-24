import Bookmark from "../Data/Bookmark.ts";
import {mkdir, exists, readTextFile, writeTextFile} from "@tauri-apps/plugin-fs";
import {appLocalDataDir, resolve} from "@tauri-apps/api/path";

export default class BookmarksStore {
    static fileName = "bookmarks.json";

    public static read = async (): Promise<Bookmark[]> => {
        const dir = await appLocalDataDir();
        const bookmarksFile = await resolve(dir, BookmarksStore.fileName);
        try {
            const json = await readTextFile(bookmarksFile);
            return JSON.parse(json);
        } catch (e) {
            // It is not an error to have no bookmarks
            return [];
        }
    }
    public static write = async (bookmarks: Bookmark[]) => {
        const dir = await appLocalDataDir();
        if (!await exists(dir)) {
            await mkdir(dir, { recursive: true});
        }
        const bookmarksFile = await resolve(dir, BookmarksStore.fileName);
        const contents = JSON.stringify(bookmarks);
        try {
            await writeTextFile(bookmarksFile, contents);
        } catch (e) {
            console.error(`write failure: ${e}`)
        }
    }
}
