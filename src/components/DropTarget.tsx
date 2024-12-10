import {useDroppable} from '@dnd-kit/core';
import React from "react";

interface DropTargetProps {
    index: number;
    className: string;
}

export const DropTarget: React.FunctionComponent<DropTargetProps> = (props: DropTargetProps) => {
    const {setNodeRef} = useDroppable({
        id: `drop-target${props.index}`,
        data: {index: props.index},
    });

    return (
        <div className={props.className} data-index={props.index} ref={setNodeRef}></div>
    );
}