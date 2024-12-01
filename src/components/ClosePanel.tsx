import React from "react";

interface ClosePanelProps {
    onClose: () => void;
}
const ClosePanel: React.FunctionComponent<ClosePanelProps> = (props) => {
    return <div className={"x-panel"}>
        <button className="close-button" onClick={props.onClose}>{<svg viewBox="0 0 26 26">
            <use href="#x"/>
        </svg>}
        </button>
    </div>
}

export default ClosePanel;