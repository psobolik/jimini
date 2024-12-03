import React from "react";
import Bookmark from "../Data/Bookmark.ts";

interface BookmarkProps {
    bookmark: Bookmark;
    className: string;
    onClick: (url: string) => void;
}

const BookmarkLink: React.FunctionComponent<BookmarkProps> = (props) => {
    const onClick = (ev: React.MouseEvent) => {
        ev.preventDefault();
        const target = ev.target as HTMLLinkElement;
        if (target) props.onClick(target.href)
    }
    return <a className={props.className} data-sequence={props.bookmark.sequence} href={props.bookmark.url}
              onClick={onClick}>{props.bookmark.url}</a>
}

export default BookmarkLink;