import "../styles/BookmarkPanel.css"

import React, {useState} from "react";
import Bookmark from "../Data/Bookmark.ts";
import BookmarkLinksStore from "../Stores/BookmarkLinksStore.ts";
import BookmarkLink from "./BookmarkLink.tsx";
import ClosePanel from "./ClosePanel.tsx";

interface BookmarkPanelProps {
    cancel: () => void;
    openUrl: (url: string) => void;
}

const BookmarkPanel: React.FunctionComponent<BookmarkPanelProps> = (props) => {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(new Array<Bookmark>);

    let bookmarks_loaded = false;
    React.useEffect(() => {
        const readBookmarks = async () => {
            if (bookmarks_loaded) return;
            BookmarkLinksStore.read()
                .then(value => {
                    setBookmarks(value);
                })
        }
        readBookmarks().catch(e => console.error(e));
        return () => {
            bookmarks_loaded = true;
        }
    }, [])
    React.useEffect(() => {
        const writeBookmarks = async () => {
            if (bookmarks) await BookmarkLinksStore.write(bookmarks);
        }
        if (bookmarks) {
            writeBookmarks().catch(e => console.error(e));
            bookmarks_loaded = false;
        }
    }, [bookmarks])

    const remove = (bookmark: Bookmark) => {
        setBookmarks(bookmarks.filter(value => value !== bookmark));
    }
    return <div id="bookmark-panel">
        <ClosePanel onClose={props.cancel}/>
        {bookmarks.length ? <div>
            {bookmarks.map((bookmark, index) => {
                return <div className={"bookmark"} key={index}>
                    <button id={"delete-button"} className={"nav-button"} onClick={() => remove(bookmark)}>{<svg
                        viewBox="0 0 26 26">
                        <use href={"#x"}/>
                    </svg>}
                    </button>
                    &emsp;
                    <BookmarkLink bookmark={bookmark} className={"link"} onClick={props.openUrl}/>
                </div>
            })}
        </div> : <div className={"info"}>No bookmarks</div>}
    </div>
}

export default BookmarkPanel;