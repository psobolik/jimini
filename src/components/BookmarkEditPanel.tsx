import Bookmark from "../Data/Bookmark.ts";
import React, {useState} from "react";
import {
    DndContext, DragEndEvent, DragMoveEvent, DragOverEvent, DragOverlay, DragStartEvent
} from "@dnd-kit/core";
import {DropTarget} from "./DropTarget.tsx";
import {DragHandle} from "./DragHandle.tsx";

interface BookmarkEditPanelProps {
    bookmarks: Bookmark[];
    cancel: () => void;
    exitMode: () => void;
    removeBookmark: (bookmark: Bookmark) => void;
    updateBookmarks: (bookmarks: Bookmark[]) => void;
}

const BookmarkEditPanel: React.FunctionComponent<BookmarkEditPanelProps> = (props) => {
    const dropTargetClassName = "bookmark-drop-target";
    const dropTargetOverClassName = "drop-target-over";

    const [draggedBookmark, setDraggedBookmark] = useState<Bookmark | null>(null)

    const removeClassName = (className: string) => {
        const allItems = document.querySelectorAll(`.${className}`);
        [...allItems].forEach(item => item.classList.remove(className));
    }
    const startDragHandler = (event: DragMoveEvent): {
        dragged: Bookmark, target: number
    } | undefined => {
        removeClassName(dropTargetOverClassName);

        if (!event.over || !event.over.data.current) return;
        if (!event.active || !event.active.data.current) return;

        const over = event.over.data.current as { index: number };
        const active = event.active.data.current as Bookmark;

        // Can't drop bookmark into slot above or below itself
        const delta = over.index - active.sequence;
        if (delta === -1 || delta === 0) return;

        return {dragged: active, target: over.index}
    }
    const onDragStart = (event: DragStartEvent) => {
        const {current} = event.active.data;
        setDraggedBookmark(current as Bookmark);
    }
    const onDragEnd = (event: DragEndEvent) => {
        setDraggedBookmark(null);
        const details = startDragHandler(event);
        if (!details) return;

        const renumbered = props.bookmarks.map(bookmark => {
            if (bookmark.sequence === details.dragged.sequence) return new Bookmark(bookmark.url, details.target)
            return new Bookmark(bookmark.url, bookmark.sequence > details.target ? bookmark.sequence + 1 : bookmark.sequence - 1)
        });
        props.updateBookmarks(renumbered);
    }
    const onDragOver = (event: DragOverEvent) => {
        const details = startDragHandler(event);
        if (!details) return;

        // Find the element we're over, i.e. the drop target with the specific index
        const dropTarget = document.querySelector(`.${dropTargetClassName}[data-index="${details.target}"]`)
        // Style the target element
        if (dropTarget) dropTarget.classList.add(dropTargetOverClassName);
    }

    return <div id="bookmark-panel">
        <div className={"x-panel"} style={{marginBottom: "0.5em"}}>&ensp;</div>
        <button onClick={() => {
            props.exitMode()
        }}>Done
        </button>
        {props.bookmarks.length ?
            <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd}
                        onDragOver={onDragOver}>
                <>
                    <DropTarget className={dropTargetClassName} index={-1}/>
                    {props.bookmarks.map((bookmark, index) => {
                        return <span key={index}>
                            <div data-sequence={bookmark.sequence} className={"bookmark-target-wrapper"}>
                                <DragHandle bookmark={bookmark}/>
                                <span className={"link"}>{bookmark.url}</span>
                                <button id={"delete-button"} style={{marginLeft: "auto"}} title={"Delete"}
                                        onClick={() => props.removeBookmark(bookmark)}>{<svg
                                    viewBox="0 0 26 26">
                                    <use href={"#trash"}/>
                                </svg>}
                                </button>
                            </div>
                            <DropTarget className={dropTargetClassName} index={index}/>
                        </span>
                    })}
                </>
                <DragOverlay dropAnimation={null}>
                    <div className={"menu-item-overlay"}>{draggedBookmark?.url}</div>
                </DragOverlay>
            </DndContext> : <div className={"info"}>No bookmarks</div>}
        <svg className="symbol-set">
            <symbol id="trash">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </symbol>
        </svg>
    </div>

}
export default BookmarkEditPanel;