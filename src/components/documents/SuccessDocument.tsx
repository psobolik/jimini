import React from "react";
import Success from "../../Data/Success.ts";
import GeminiDocument from "./GeminiDocument.tsx";
import PlainDocument from "./PlainDocument.tsx";

interface SuccessDocumentProps {
    hidden: boolean;
    success: Success | undefined;
    baseUrl: string;
    setLink: (link: string) => void;
    openUrl: (url: URL) => void;
}

export const SuccessDocument: React.FunctionComponent<SuccessDocumentProps> = props => {
    if (props.hidden || props.success === undefined) return <></>

    return props.success.isGemini() ? <GeminiDocument
        success={props.success}
        baseUrl={props.baseUrl}
        setLink={props.setLink}
        openUrl={props.openUrl}
    /> : props.success.isTextLike() ? <PlainDocument lines={props.success.lines()}/> : <></>
}
export default SuccessDocument;

