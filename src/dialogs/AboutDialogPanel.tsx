import React from "react";
import Logo from "../components/Logo.tsx";
import Version from "../components/Version.tsx";
import Copyright from "../components/Copyright";
import ClosePanel from "../components/ClosePanel.tsx";

interface AboutDialogPanelProps {
    onCancel: () => void;
}

const AboutDialogPanel: React.FunctionComponent<AboutDialogPanelProps> = (props) => {
    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') cancel();
    }
    const cancel = () => {
        props.onCancel();
    }

    return <span onKeyDown={onKeyDown}>
        <ClosePanel onClose={cancel}/>
        <Logo/>
        <Version/>
        <Copyright/>
    </span>
}
export default AboutDialogPanel;
