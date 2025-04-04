import React from "react";
import Success from "../../Data/Success.ts";

interface GeminiDocumentProps {
    success: Success;
    baseUrl: string;
    setLink: (footer: string) => void;
    openUrl: (url: URL) => void;
}

const GeminiDocument: React.FunctionComponent<GeminiDocumentProps> = props => {
    const {success, baseUrl, setLink, openUrl} = props;

    const onLinkClick = (target: HTMLElement)=> {
        let link = target.dataset.link;
        if (link) openUrl(new URL(link, props.baseUrl));
    }
    const showLink = (target: HTMLElement) => {
        let link = target.dataset.link;
        if (link) {
            setLink(new URL(link, props.baseUrl).toString());
        }
    }
    const hideLink = () => {
        setLink("")
    }
    const stripAnsiSequences = (line: string): string => {
        // Ought not be in there anyway...
        const re = /\x1b\[[\x20-\x3f]*[\x40-\x7e]*/g;
        return line.replaceAll(re, "");
    }
    const lines: React.ReactNode[] = [];
    let key = 0;
    success.parseGeminiDocument({
        preformattedText: (preformattedText => {
            const preformattedChildren = preformattedText.map((line, index) => {
                return <span key={index}>{stripAnsiSequences(line)}<br/></span>
            });
            lines.push(<pre key={key++}>{preformattedChildren}</pre>);
        }), link: (jiminiLink => {
            try {
                const url = new URL(jiminiLink.link, baseUrl);
                let className = "link";
                if (url.protocol !== "gemini:") className += " foreign-link"
                lines.push(<div key={key++}>
                    <a href={"#"} className={className} data-link={jiminiLink.link}
                       onFocus={e => showLink(e.target as HTMLElement)}
                       onBlur={hideLink}
                       onMouseEnter={e => showLink(e.target as HTMLElement)}
                       onMouseLeave={hideLink}
                       onClick={e => onLinkClick(e.target as HTMLElement)}>
                        {jiminiLink.name}
                    </a>
                </div>)
            } catch (e) {
                // This prevents an invalid URL from crashing the app
                console.error(e);
            }
        }), quotedText: (quotedText => {
            lines.push(<div className="quote" key={key++}>{quotedText}</div>);
        }), listItem: (listItem => {
            lines.push(<div className="list-item" key={key++}>{listItem}</div>);
        }), heading: (heading => {
            switch (heading.level) {
                case 1:
                    lines.push(<h1 key={key++}>{heading.text}</h1>)
                    break;
                case 2:
                    lines.push(<h2 key={key++}>{heading.text}</h2>)
                    break;
                case 3:
                    lines.push(<h3 key={key++}>{heading.text}</h3>)
                    break;
                default:
                    lines.push(<div className="text" key={key++}>{heading.text}</div>)
            }
        }), plainText: (plainText => {
            lines.push(<div className="text" key={key++}>{plainText}</div>)
        })
    })
    return <>{lines}</>;
}
export default GeminiDocument;