import "../styles/HamburgerMenu.css"
import React from "react";

interface MenuProps {
    onShowAbout: () => void;
    onSave: () => void;
    onSettings: () => void;
}

const HamburgerMenu: React.FunctionComponent<MenuProps> = (props) => {
    const [isMenuVisible, setIsMenuVisible] = React.useState(false);

    React.useEffect(() => {
        if (isMenuVisible) {
            window.addEventListener('click', hideMenu);
        } else {
            window.removeEventListener('click', hideMenu)
        }
        return () => window.removeEventListener('click', hideMenu);
    }, [isMenuVisible, setIsMenuVisible]);

    const hideMenu = () => {
        setIsMenuVisible(false)
    }
    const toggleMenu = (ev) => {
        ev.stopPropagation();
        setIsMenuVisible(!isMenuVisible);
    }
    return <>
        <button id={"menu-button"} className={"nav-button"} onClick={toggleMenu}>{<svg>
            <use href="#h-line" y="3"/>
            <use href="#h-line" y="7"/>
            <use href="#h-line" y="11"/>
        </svg>}
        </button>
        {isMenuVisible && <div id={"menu"}>
            <div onClick={props.onSave} className={"spacer"}>Save as...</div>
            <div onClick={props.onSettings} className={"spacer"}>Settings</div>
            <div onClick={props.onShowAbout}>About</div>
        </div>}
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
            <symbol id="h-line" viewBox="0 0 16 16">
                <line x1="1" y1="1" x2="15" y2="1" strokeLinecap="round"/>
            </symbol>
        </svg>
    </>
}

export default HamburgerMenu;