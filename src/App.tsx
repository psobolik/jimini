import "./App.css";
import React from "react";
import Redirect from "./Data/Redirect.ts";
import Failure from "./Data/Failure.ts";
import Success, {SuccessResult} from "./Data/Success.ts"
import Prompt from "./Data/Prompt.ts";
import Util from "./Util.ts";
import GeminiLine, {LineType} from "./Data/GeminiLine.ts";
import GeminiLink from "./Data/GeminiLink.ts";
import Tauri from "./Tauri.ts";
import UrlHistory from "./UrlHistory.ts";
import InputDialog from "./dialogs/InputDialog.tsx";
import {getMatches} from "@tauri-apps/api/cli";
import {downloadDir} from "@tauri-apps/api/path";
import {GeminiResponse} from "./Data/GeminiResponse.ts";
import {save} from "@tauri-apps/api/dialog";
import { writeBinaryFile } from "@tauri-apps/api/fs";
import Certificate from "./Data/Certificate.ts";

function App() {
    const URL_HISTORY_CAPACITY = 20;

    const [info, setInfo] = React.useState<string>("");
    const [geminiError, setGeminiError] = React.useState<string>("");
    const [urlString, setUrlString] = React.useState<string>("");
    const [urlInputString, setUrlInputString] = React.useState<string>("");
    const [success, setSuccess] = React.useState<Success | undefined>(undefined);
    const [inlineImageSrc, setInlineImageSrc] = React.useState<string | undefined>("");
    const [noHistory, setNoHistory] = React.useState<boolean>(false);
    const [urlHistory, _setUrlHistory] = React.useState<UrlHistory>(new UrlHistory(URL_HISTORY_CAPACITY));
    const [promptForSensitiveInput, setPromptForSensitiveInput] = React.useState<boolean>(false);
    const [promptForInput, setPromptForInput] = React.useState<boolean>(false);
    const [dialogContent, setDialogContent] = React.useState<React.ReactNode>(<></>);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [footer, setFooter] = React.useState<string>("");

    React.useEffect(() => {
        window.addEventListener("keyup", onKeyUp);
        return () => window.removeEventListener("keyup", onKeyUp);
    }, [])
    React.useEffect(() => {
        getMatches().then((matches) => {
            if (matches.args.url.value) {
                setUrlString(matches.args.url.value.toString());
            } else {
                const lines = [
                    "```",
                    "       _   _               _           _",
                    "      {_} {_}             {_}         {_}",
                    "       _   _   _ __ ___    _   _ __    _ ",
                    "      | | | | | '_ ` _ \\  | | | '_ \\  | |",
                    "      | | | | | | | | | | | | | | | | | |",
                    "  _   | | |_| |_| |_| |_| |_| |_| |_| |_|",
                    " | |__| |",
                    "  \\____/        A Gemini Protocol Browser",
                    "```"
                ];
                localSuccess(lines.join("\n"));
            }
        })
        return () => setUrlString("");
    }, [])
    React.useEffect(() => {
        if (urlString) {
            makeRequest().then();
        }
    }, [urlString]);

    const localSuccess = (message: string) => {
        const body = [];
        for (let i = 0; i < message.length; ++i) {
            body.push(message.charCodeAt(i))
        }
        const successResult: SuccessResult = ({
            code: "20",
            status: "20 text/gemini",
            mime_type: "text/gemini",
            body: body
        }) as SuccessResult;
        setSuccess(new Success(successResult))
    }
    const makeRequest = async () => {
        setLoading(true);

        const url = Util.toUrl(urlString);
        if (url.protocol === "gemini:") {
            setUrlInputString(urlString);
            setGeminiError("");
            setInfo("");
            setSuccess(undefined);
            setInlineImageSrc(undefined);
            setFooter("");

            // This timeout gives the UI enough time to display the loading message,
            // but the UI freezes during the Tauri call, so we aren't bothering with
            // animation.
            setTimeout(() => {
                Tauri.makeGeminiRequest(url)
                    .then(result => {
                        setLoading(false);
                        setResult(result, url)
                    })
                    .catch(error => {
                        if (!noHistory) {
                            urlHistory.add(url);
                        }
                        setLoading(false);
                        setGeminiError(error);
                    });
            }, 100)
        } else {
            // Pass requests for everything except "gemini:" off to the OS.
            // open_detached doesn't necessarily return an error if it doesn't do anything,
            // so this might fail silently.
            Tauri.open_detached(urlString)
                .finally(() => setLoading(false))
                .catch(error => setGeminiError(error));
        }
    }
    const saveOctets = (url: URL, octets: number[]) => {
        const getSavePath = async (url: URL) => {
            const suggestedFilename = url.toString();
            return await save({
                defaultPath: `${await downloadDir()}/${suggestedFilename}`
            });
        }
        getSavePath(url)
            .then(savePath => {
                if (savePath) {
                    writeBinaryFile(savePath, octets).then();
                }
            })
    }
    const onKeyUp = async (e: KeyboardEvent) => {
        if (e.altKey) {
            switch (e.key) {
                case "ArrowLeft":
                    previous();
                    break;
                case "ArrowRight":
                    next();
                    break;
            }
        }
    }
    const onUrlKeyUp = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            doRequest();
        }
    }
    const doRequest = () => {
        setNoHistory(false);
        const split = urlInputString.split("://", 2);
        setUrlString(split.length < 2 ? `gemini://${urlInputString}` : urlInputString);
    }
    const setResult = (result: GeminiResponse, url: URL) => {
        if (result.prompt) {
            const prompt = new Prompt(result.prompt);
            if (!noHistory) {
                urlHistory.add(url);
            }
            setDialogContent(<p>{prompt.prompt}</p>);
            if (prompt.isSensitive()) {
                setPromptForSensitiveInput(true);
            } else {
                setPromptForInput(true);
            }
        } else if (result.success) {
            const success = new Success(result.success);
            // Only add the URL to the history if we weren't asked not to, and we're going to display something
            if (!noHistory) {
                urlHistory.add(url);
            }
            if (success.isGemini() || success.isText()) {
                setSuccess(success);
            } else if (success.isImage()) {
                Tauri.base64_encode(success.body)
                    .then(data => {
                        setInlineImageSrc(`data:${success.mimeType?.toString()};base64,${data}`);
                    })
            } else {
                // localSuccess(`### Can't display MIME type "${success.mimeType}"\n`);
                setInfo(`Can't display MIME type "${success.mimeType}"\n`)
                saveOctets(url, success.body);
            }
        }
        else if (result.redirect) {
            const redirect = new Redirect(result.redirect);
            setNoHistory(!redirect.isPermanent());
            setUrlString(new URL(redirect.url, urlString).toString());
        }
        else if (result.failure) {
            const failure = new Failure(result.failure);
            if (!noHistory) {
                urlHistory.add(url);
            }
            setGeminiError(failure.toString());
        } else if (result.certificate) {
            const certificate = new Certificate(result.certificate)
            if (!noHistory) {
                urlHistory.add(url);
            }
            setInfo(`Unsupported response: ${certificate.toString()}`);

        }
    }

    function onLinkClick(target: HTMLElement) {
        let link = target.dataset.link;
        if (link) {
            setNoHistory(false);
            setUrlString(new URL(link, urlInputString).toString());
        }
    }

    const onLinkHover = (target: HTMLElement, show: boolean) => {
        if (show) {
            let link = target.dataset.link;
            if (link) {
                setFooter(new URL(link, urlInputString).toString());
            }
        } else setFooter("");
    }
    const formatGeminiSuccess = (success: Success) => {
        let preformattedChildren: React.ReactNode[] = [];
        let preformat = false;
        const lines: React.ReactNode[] = [];
        success.lines().forEach((line, index) => {
            const geminiLine = GeminiLine.parseLine(line);
            if (geminiLine.type === LineType.PreformatToggle) {
                if (!preformat) {
                    preformattedChildren = [];
                } else {
                    lines.push(<pre key={index}>{preformattedChildren}</pre>);
                }
                preformat = !preformat;
            } else if (preformat) {
                preformattedChildren.push(<div key={index}>{line}</div>);
            } else switch (geminiLine.type) {
                case LineType.Link:
                    const link = GeminiLink.parseString(geminiLine.text ?? "");
                    lines.push(<div key={index}>
                        <span className="link" data-link={link.link}
                              onMouseEnter={e => onLinkHover(e.target as HTMLElement, true)}
                              onMouseLeave={e => onLinkHover(e.target as HTMLElement, false)}
                              onClick={e => onLinkClick(e.target as HTMLElement)}>{link.name}
                        </span>
                    </div>);
                    break;
                case LineType.Heading1:
                    lines.push(<h1 key={index}>{geminiLine.text}</h1>);
                    break;
                case LineType.Heading2:
                    lines.push(<h2 key={index}>{geminiLine.text}</h2>);
                    break;
                case LineType.Heading3:
                    lines.push(<h3 key={index}>{geminiLine.text}</h3>);
                    break;
                case LineType.ListItem:
                    lines.push(<div className="list-item" key={index}>{geminiLine.text}</div>);
                    break;
                case LineType.Quote:
                    lines.push(<div className="quote" key={index}>{geminiLine.text}</div>);
                    break;
                default:
                    lines.push(<div className="text" key={index}>{line}</div>);
            }
        });
        return lines;
    }
    const formatPlainSuccess = (success: Success) => {
        return <div className="plain">{success.lines().map((line, index) => <div key={index}>{line}</div>)}</div>
    }
    const formatSuccess = () => {
        return <div
            id="success">{success ? success.isGemini() ? formatGeminiSuccess(success) : formatPlainSuccess(success) : <></>}</div>
    }
    const formatError = () => {
        return geminiError ? <p id="gemini_error">{geminiError}</p> : <></>;
    }
    const formatImage = () => {
        return inlineImageSrc ? <img alt={urlString} src={inlineImageSrc}/> : <></>;
    }
    const formatInfo = () => {
        return info ? <p id="info">{info}</p> : <></>
    }
    const previous = () => {
        let previousUrl = urlHistory.previousUrl();
        if (previousUrl) {
            setNoHistory(true);
            setUrlString(previousUrl.toString());
        }
    }
    const next = () => {
        let nextUrl = urlHistory.nextUrl();
        if (nextUrl) {
            setNoHistory(true);
            setUrlString(nextUrl.toString());
        }
    }
    const closeInputDialog = () => {
        setPromptForInput(false);
        setPromptForSensitiveInput(false);
    }
    const finishInput = () => {
        closeInputDialog();
        urlHistory.removeCurrentUrl();
        setNoHistory(true);
    }
    const onInput = (value: string) => {
        finishInput();
        setUrlString(`${urlInputString}?${value}`); // Navigate to URL with parameter
    }
    const onInputCancel = () => {
        finishInput();
        setUrlString(urlHistory.currentUrl()?.toString() ?? "");
    }
    return (<>
        <header>
            <button id="previous-button" className="nav-button" onClick={previous}
                    disabled={!urlHistory.hasPreviousUrl()}>{<svg>
                <use href="#caret-up"/>
            </svg>}
            </button>
            <button id="next-button" className="nav-button" onClick={next} disabled={!urlHistory.hasNextUrl()}>{<svg>
                <use href="#caret-up"/>
            </svg>}</button>
            <input type="text" placeholder="Gemini URL" id="gemini-url-input"
                   value={urlInputString}
                   onChange={e => setUrlInputString(e.target.value)}
                   onKeyUp={onUrlKeyUp}
            />
            <button onClick={doRequest} disabled={urlInputString.length === 0}>Go</button>
        </header>
        <div className="container">
            <div className={loading ? "loading" : "not-loading"}>Loading...</div>
            {formatInfo()}
            {formatError()}
            {formatSuccess()}
            {formatImage()}
            <InputDialog
                isOpen={promptForInput || promptForSensitiveInput}
                onInput={onInput}
                onCancel={onInputCancel}
                dialogContent={dialogContent}
                isSensitive={promptForSensitiveInput}
            />
        </div>
        <footer>{footer}</footer>
        <svg style={{display: "none"}} xmlns="http://www.w3.org/2000/svg">
            <symbol id="caret-up" viewBox="0 0 16 16">
                <path
                    d="M3.204 11h9.592L8 5.519 3.204 11zm-.753-.659 4.796-5.48a1 1 0 0 1 1.506 0l4.796 5.48c.566.647.106 1.659-.753 1.659H3.204a1 1 0 0 1-.753-1.659z"/>
            </symbol>
        </svg>
    </>);
}

export default App;
