import React from "react";

interface PlainDocumentProps {
    lines: string[]
}

const PlainDocument: React.FunctionComponent<PlainDocumentProps> = props => {
    return <div className="plain">{props.lines.map((line, index) => <div key={index}>{line}</div>)}</div>
}
export default PlainDocument;