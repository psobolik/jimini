import Bookmark from "../Data/Bookmark.ts";
import React from "react";
import ClosePanel from "./ClosePanel.tsx";
import BookmarkLink from "./BookmarkLink.tsx";

interface BookmarkSelectPanelProps {
    bookmarks: Bookmark[];
    cancel: () => void;
    exitMode: () => void;
    openUrl: (url: string) => void;
}

const BookmarkSelectPanel: React.FunctionComponent<BookmarkSelectPanelProps> = (props) => {
    return <div id="bookmark-panel">
        <ClosePanel onClose={props.cancel}/>
        {props.bookmarks.length > 0 ? <>
            <button onClick={() => {
                props.exitMode()
            }}>Edit
            </button>
            <ul className={"link-panel"}>
                {props.bookmarks.map((bookmark, index) => {
                    return <li key={index}><BookmarkLink bookmark={bookmark} className={"link"}
                                                         onClick={props.openUrl}/></li>
                })}
            </ul>
        </> : <div className={"info"}>No bookmarks</div>}
    </div>
}

export default BookmarkSelectPanel;