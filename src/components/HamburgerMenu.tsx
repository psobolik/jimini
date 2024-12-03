import "../styles/HamburgerMenu.css"
import React from "react";

interface MenuProps {
    onShowAbout: () => void;
    onSave: () => void;
    onSettings: () => void;
    onShowBookmarkPanel: () => void;
}

const HamburgerMenu: React.FunctionComponent<MenuProps> = (props) => {
    const [isMenuVisible, setIsMenuVisible] = React.useState(false);

    React.useEffect(() => {
        if (isMenuVisible) {
            window.addEventListener('click', hideMenu);
            addFocusListeners();
        } else {
            window.removeEventListener('click', hideMenu);
            removeFocusListeners();
        }
        return () => {
            window.removeEventListener('click', hideMenu);
            removeFocusListeners();
        }
    }, [isMenuVisible, setIsMenuVisible]);

    const addFocusListeners = () => {
        const elements = document.querySelectorAll(":not(#menu a)");
        elements.forEach(element => element.addEventListener('focus', hideMenu));
    }
    const removeFocusListeners = () => {
        const elements = document.querySelectorAll(":not(#menu a)");
        elements.forEach(element => element.removeEventListener('focus', hideMenu));
    }
    const hideMenu = () => {
        setIsMenuVisible(false)
    }
    const toggleMenu = (ev: React.MouseEvent) => {
        ev.stopPropagation();
        setIsMenuVisible(!isMenuVisible);
    }
    return <>
        <button id={"menu-button"} className={"nav-button"} onClick={toggleMenu}>{<svg viewBox="0 0 26 26">
            <use href="#horizontal-line" y="5"/>
            <use href="#horizontal-line" y="12"/>
            <use href="#horizontal-line" y="19"/>
            <symbol id="horizontal-line">
                <line x1="1" y1="1" x2="25" y2="1" strokeLinecap="round"/>
            </symbol>
        </svg>}
        </button>
        {isMenuVisible && <div id={"menu"}>
            <a href="#" onClick={props.onSave}>Save as...</a>
            <a href="#" onClick={props.onSettings}>Settings</a>
            <a href="#" onClick={props.onShowBookmarkPanel}>Bookmarks</a>
            <a href="#" onClick={props.onShowAbout}>About</a>
        </div>}
    </>
}

export default HamburgerMenu;
