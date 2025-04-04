import React from "react";

interface InfoPanelProps {
    hidden: boolean;
    text: string;
    id: string;
}

const InfoPanel: React.FunctionComponent<InfoPanelProps> = (props) => {
    return props.hidden ? <></> : <p id={props.id}>{props.text}</p>;
}
export default InfoPanel;