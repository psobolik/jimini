import "../styles/BookmarkPanel.css"

import React, {useState} from "react";
import Bookmark from "../Data/Bookmark.ts";
import BookmarkEditPanel from "./BookmarkEditPanel.tsx";
import BookmarkSelectPanel from "./BookmarkSelectPanel.tsx";

interface BookmarkPanelProps {
    cancel: () => void;
    openUrl: (url: string) => void;
    removeBookmark: (bookmark: Bookmark) => void;
    updateBookmarks: (bookmarks: Bookmark[]) => void;
    bookmarks: Bookmark[];
}

enum BookmarkPanelMode {
    Select,
    Edit
}
const BookmarkPanel: React.FunctionComponent<BookmarkPanelProps> = (props) => {
    const [panelMode, setPanelMode] = useState<BookmarkPanelMode>(BookmarkPanelMode.Select);

    return panelMode === BookmarkPanelMode.Edit
        ? <BookmarkEditPanel bookmarks={props.bookmarks} cancel={props.cancel} exitMode={() => setPanelMode(BookmarkPanelMode.Select)}
                           removeBookmark={props.removeBookmark} updateBookmarks={props.updateBookmarks}/>
        : <BookmarkSelectPanel bookmarks={props.bookmarks} cancel={props.cancel} exitMode={() => setPanelMode(BookmarkPanelMode.Edit)}
                             openUrl={props.openUrl}/>;
}

export default BookmarkPanel;