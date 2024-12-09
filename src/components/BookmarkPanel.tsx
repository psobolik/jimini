import "../styles/BookmarkPanel.css"

import React, {useState} from "react";
import Bookmark from "../Data/Bookmark.ts";
import BookmarkLink from "./BookmarkLink.tsx";
import ClosePanel from "./ClosePanel.tsx";
import {
    DndContext, DragEndEvent, DragMoveEvent, DragOverEvent, DragOverlay, DragStartEvent, pointerWithin
} from "@dnd-kit/core";
import {DragHandle} from "./DragHandle.tsx";
import {DropTarget} from "./DropTarget.tsx";

interface BookmarkPanelProps {
    cancel: () => void;
    openUrl: (url: string) => void;
    removeBookmark: (bookmark: Bookmark) => void;
    updateBookmarks: (bookmarks: Bookmark[]) => void;
    bookmarks: Bookmark[];
}

const BookmarkPanel: React.FunctionComponent<BookmarkPanelProps> = (props) => {
    const [editMode, setEditMode] = useState<boolean>(false);
    const [draggedBookmark, setDraggedBookmark] = useState<Bookmark | null>(null)

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

    const onDragStart = (event: DragStartEvent) => {
        const {current} = event.active.data;
        setDraggedBookmark(current as Bookmark);
    }
    const onDragEnd = (event: DragEndEvent) => {
        setDraggedBookmark(null);
        const details = startDragHandler(event);
        if (!details) return;

        const n = details.above ? details.target.sequence - 1 : details.target.sequence;
        const renumbered = props.bookmarks.map(bookmark => {
            if (bookmark.sequence === details.dragged.sequence) return new Bookmark(bookmark.url, details.target.sequence)
            return new Bookmark(bookmark.url, bookmark.sequence > n ? bookmark.sequence + 1 : bookmark.sequence - 1)
        });
        props.updateBookmarks(renumbered);
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
        return <div id="bookmark-panel">
            <ClosePanel onClose={props.cancel}/>
            {props.bookmarks.length > 0 ? <>
                <button onClick={() => {
                    setEditMode(true)
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
    const editBookmarksPanel = () => {
        return <div id="bookmark-panel">
            <div className={"x-panel"} style={{marginBottom: "0.5em"}}>&ensp;</div>
            <button onClick={() => {
                setEditMode(false)
            }}>Done
            </button>
            {props.bookmarks.length ?
                <DndContext collisionDetection={pointerWithin} onDragStart={onDragStart} onDragEnd={onDragEnd}
                            onDragOver={onDragOver}>
                    <div>
                        {props.bookmarks.map((bookmark, index) => {
                            return <div key={index} data-sequence={bookmark.sequence}
                                        className={"bookmark-target-wrapper"}>
                                <DropTarget bookmark={bookmark} className={"bookmark-drop-target"}>
                                    <DragHandle bookmark={bookmark}/>
                                    <span className={"link"}>{bookmark.url}</span>
                                    <button id={"delete-button"} style={{marginLeft: "auto"}} title={"Delete"}
                                            onClick={() => props.removeBookmark(bookmark)}>{<svg
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