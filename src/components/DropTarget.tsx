import {useDroppable} from '@dnd-kit/core';
import Bookmark from "../Data/Bookmark.ts";
import React from "react";

interface DropTargetProps {
    bookmark: Bookmark;
    children: React.ReactNode;
    className: string;
}

export const DropTarget: React.FunctionComponent<DropTargetProps> = (props: DropTargetProps) => {
    const {setNodeRef} = useDroppable({
        id: `drop-target${props.bookmark.sequence}`,
        data: props.bookmark,
    });

    return (
        <span ref={setNodeRef} className={props.className}>
            {props.children}
        </span>
    );
}