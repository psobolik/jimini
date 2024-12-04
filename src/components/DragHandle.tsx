import React from "react";
import {useDraggable} from "@dnd-kit/core";
import Bookmark from "../Data/Bookmark.ts";

export interface DragHandleProps {
    bookmark: Bookmark;
}

export const DragHandle: React.FunctionComponent<DragHandleProps> = (props: DragHandleProps) => {
    const {attributes, listeners, setNodeRef} = useDraggable({
        id: `draggable${props.bookmark.sequence}`,
        data: props.bookmark
    });
    return (
        <button ref={setNodeRef} {...attributes} {...listeners}>
            <svg className={"drag-handle"} viewBox="0 0 20 20" width="12">
                <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"></path>
            </svg>
        </button>
    );
}