import React from "react";
import HamburgerMenu from "./HamburgerMenu.tsx";

interface HeaderProps {
    saveDocument: () => void;
    showSettings: () => void;
    showAbout: () => void;
    showBookmarks: () => void;
    canGoHome: boolean;
    goHome: () => void;
    canAddBookmark: boolean;
    addBookmark: () => void;
    canShowPrevious: boolean;
    showPrevious: () => void;
    canShowNext: boolean;
    showNext: () => void;
    url: string;
    canOpenUrl: boolean;
    openUrl: () => void;
    setUrl: (url: string) => void;
    onUrlKeyUp: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}
const Header: React.FunctionComponent<HeaderProps> = (props) => {
    return <header>
        <HamburgerMenu onSave={props.saveDocument} onSettings={props.showSettings}
                       onShowAbout={props.showAbout}
                       onShowBookmarkPanel={props.showBookmarks}
        />
        <button id={"home-button"} className={"nav-button"} onClick={props.goHome} title={"Open home page"}
                disabled={!props.canGoHome}>{<svg viewBox="0 0 26 26">
            <polygon
                points="13,3 25,14 20,14 20,22 15,22 15,17 11,17 11,22 6,22 6,14 1,14"
                strokeLinejoin="round"
            />
        </svg>}
        </button>
        <button id={"bookmark-button"} className={"nav-button"} onClick={props.addBookmark}
                title={"Bookmark current page"}
                disabled={!props.canAddBookmark}>{<svg viewBox="0 0 26 26">
            <polygon
                points="19,24 13,16 7,24 7,3 19,3"
                strokeLinejoin="round"
            />
        </svg>}
        </button>
        <button id="previous-button" className="nav-button" onClick={props.showPrevious} title={"Previous"}
                disabled={!props.canShowPrevious}>{<svg viewBox="0 0 26 26">
            <use href="#triangle" transform="rotate(-90, 13, 13)"/>
        </svg>}
        </button>
        <button id="next-button" className="nav-button" onClick={props.showNext} title={"Next"}
                disabled={!props.canShowNext}>{<svg
            viewBox="0 0 26 26">
            <use href="#triangle" transform="rotate(90, 13, 13)"/>
        </svg>}</button>
        <input type="text" placeholder="Gemini URL" id="gemini-url-input"
               value={props.url}
               onChange={e => props.setUrl(e.target.value)}
               onKeyUp={props.onUrlKeyUp}
        />
        <button onClick={props.openUrl} disabled={props.canOpenUrl}>Open</button>
    </header>
}
export default Header;