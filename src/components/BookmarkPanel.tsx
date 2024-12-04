import "../styles/BookmarkPanel.css"

import React, {useState} from "react";
import Bookmark from "../Data/Bookmark.ts";
import BookmarksStore from "../Stores/BookmarksStore.ts";
import BookmarkLink from "./BookmarkLink.tsx";
import ClosePanel from "./ClosePanel.tsx";
import {
    DndContext,
    DragEndEvent,
    DragMoveEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    pointerWithin
} from "@dnd-kit/core";
import {DragHandle} from "./DragHandle.tsx";
import {DropTarget} from "./DropTarget.tsx";

interface BookmarkPanelProps {
    cancel: () => void;
    openUrl: (url: string) => void;
}

const BookmarkPanel: React.FunctionComponent<BookmarkPanelProps> = (props) => {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(new Array<Bookmark>);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [draggedBookmark, setDraggedBookmark] = useState<Bookmark | null>(null)

    let bookmarks_loaded = false;
    React.useEffect(() => {
        const readBookmarks = async () => {
            if (bookmarks_loaded) return;
            BookmarksStore.read()
                .then(value => {
                    setBookmarks(Bookmark.sortAndRenumber(value));
                })
        }
        readBookmarks().catch(e => console.error(e));
        return () => {
            bookmarks_loaded = true;
        }
    }, [])
    React.useEffect(() => {
        const writeBookmarks = async () => {
            if (bookmarks) await BookmarksStore.write(bookmarks);
        }
        if (bookmarks) {
            writeBookmarks().catch(e => console.error(e));
            bookmarks_loaded = false;
        }
    }, [bookmarks])

    const remove = (bookmark: Bookmark) => {
        setBookmarks(bookmarks.filter(value => value !== bookmark));
    }

    const clearDropTarget = () => {
        const removeClassName = (className: string) => {
            const allItems = document.querySelectorAll(`.${className}`);
            [...allItems].forEach(item => item.classList.remove(className));
        }
        removeClassName("drop-target-above");
        removeClassName("drop-target-below");
    }
    const startDragHandler = (event: DragMoveEvent): {
        dragged: Bookmark, target: Bookmark, above: boolean
    } | undefined => {
        clearDropTarget();

        if (!event.over || !event.over.data.current) return;
        if (!event.active || !event.active.data.current) return;

        const over = event.over.data.current as Bookmark;
        const active = event.active.data.current as Bookmark;

        const above = (event.activatorEvent as PointerEvent).altKey
        const delta = active.sequence - over.sequence;
        // Can't drop a link on itself, below the link above it or above the link below it
        if (delta === 0 || (delta === -1 && above) || (delta === 1 && !above)) return;

        return {dragged: active, target: over, above: above}
    }

    const onDragStart = (event: DragStartEvent)=> {
        const {current} = event.active.data;
        setDraggedBookmark(current as Bookmark);
    }
    const onDragEnd = (event: DragEndEvent) => {
        setDraggedBookmark(null);
        const details = startDragHandler(event);
        if (!details) return;

        const n = details.above ? details.target.sequence - 1 : details.target.sequence;
        const renumbered = bookmarks.map(bookmark => {
            if (bookmark.sequence === details.dragged.sequence) return new Bookmark(bookmark.url, details.target.sequence)
            return new Bookmark(bookmark.url, bookmark.sequence > n ? bookmark.sequence + 1 : bookmark.sequence - 1)
        });
        setBookmarks(Bookmark.sortAndRenumber(renumbered));
    }
    const onDragOver = (event: DragOverEvent) => {
        const details = startDragHandler(event);
        if (!details) return;

        // Find the element we're over
        const link = document.querySelector(`div.bookmark-target-wrapper[data-sequence="${details.target.sequence}"]`)
        // Style the target element
        if (link) link.classList.add(details.above ? "drop-target-above" : "drop-target-below");
    }
    const selectBookmarkPanel = () => {
        const anyBookmarks = bookmarks.length > 0;
        return <div id="bookmark-panel">
            <ClosePanel onClose={props.cancel}/>
            {anyBookmarks && <button onClick={() => {
                setEditMode(true)
            }}>Edit</button>}
            {anyBookmarks ? bookmarks.map((bookmark, index) => {
                return <ul key={index} className={"link-panel"}>
                    <li><BookmarkLink bookmark={bookmark} className={"link"}
                                      onClick={props.openUrl}/></li>
                </ul>
            }) : <div className={"info"}>No bookmarks</div>}
        </div>
    }
    const editBookmarksPanel = () => {
        return <div id="bookmark-panel">
            <button onClick={() => {
                setEditMode(false)
            }}>Quit edit
            </button>
            {bookmarks.length ?
                <DndContext collisionDetection={pointerWithin} onDragStart={onDragStart} onDragEnd={onDragEnd}
                            onDragOver={onDragOver}>
                    <div>
                        {bookmarks.map((bookmark, index) => {
                            return <div key={index} data-sequence={bookmark.sequence}
                                        className={"bookmark-target-wrapper"}>
                                <DropTarget bookmark={bookmark} className={"bookmark-drop-target"}>
                                    <DragHandle bookmark={bookmark}/>
                                    <span className={"link"}>{bookmark.url}</span>
                                    <button id={"delete-button"} style={{marginLeft: "auto"}} title={"Delete"}
                                            onClick={() => remove(bookmark)}>{<svg
                                        viewBox="0 0 26 26">
                                        <use href={"#trash"}/>
                                    </svg>}
                                    </button>
                                </DropTarget>
                            </div>
                        })}
                    </div>
                    {draggedBookmark && <DragOverlay>
                        <div className={"menu-item-overlay"}>{draggedBookmark.url}</div>
                    </DragOverlay>}
                </DndContext> : <div className={"info"}>No bookmarks</div>}
            <svg className="symbol-set">
                <symbol id="trash">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </symbol>
            </svg>
        </div>
    }
    return editMode ? editBookmarksPanel() : selectBookmarkPanel();
}

export default BookmarkPanel;