import Bookmark from "../Data/Bookmark.ts";
import {createDir, exists, readTextFile, writeTextFile} from "@tauri-apps/api/fs";
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
            // No bookmarks is not an error
            return [];
        }
    }
    public static write = async (bookmarks: Bookmark[]) => {
        const dir = await appLocalDataDir();
        if (!await exists(dir)) {
            await createDir(dir, {recursive: true});
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
