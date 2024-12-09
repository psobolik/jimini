import "./styles/App.css";
import React from "react";
import Tauri from "./Tauri.ts";
import {getMatches} from "@tauri-apps/api/cli";
import {downloadDir} from "@tauri-apps/api/path";
import {save} from "@tauri-apps/api/dialog";
import {writeBinaryFile} from "@tauri-apps/api/fs";
import Certificate from "./Data/Certificate.ts";
import Redirect from "./Data/Redirect.ts";
import Failure from "./Data/Failure.ts";
import Success from "./Data/Success.ts"
import GeminiLine, {LineType} from "./Data/GeminiLine.ts";
import GeminiResponse from "./Data/GeminiResponse.ts";
import Prompt from "./Data/Prompt.ts";
import {ColorScheme, Settings, TextSize} from "./Data/Settings.ts";
import SettingsStore from "./Stores/SettingsStore.ts"
import Util from "./Util.ts";
import JiminiLink from "./Data/JiminiLink.ts";
import UrlHistory from "./UrlHistory.ts";
import InputDialog from "./dialogs/InputDialog.tsx";
import AboutDialog from "./dialogs/AboutDialog.tsx";
import SettingsDialog from "./dialogs/SettingsDialog.tsx";
import HamburgerMenu from "./components/HamburgerMenu.tsx";
import BookmarkPanel from "./components/BookmarkPanel.tsx";
import BookmarksStore from "./Stores/BookmarksStore.ts";
import Bookmark from "./Data/Bookmark.ts";

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
    const [showAbout, setShowAbout] = React.useState<boolean>(false);
    const [showSettings, setShowSettings] = React.useState<boolean>(false);
    const [showBookmarkPanel, setShowBookmarkPanel] = React.useState<boolean>(false);
    const [bookmarks, setBookmarks] = React.useState<Bookmark[]>(new Array<Bookmark>);
    const [settings, setSettings] = React.useState<Settings>(new Settings());

    React.useEffect(() => {
        window.addEventListener("keyup", onKeyUp);
        return () => window.removeEventListener("keyup", onKeyUp);
    }, [])
    let is_setup = false;
    React.useEffect(() => {
        const readSettings = async () => {
            if (is_setup) return;
            SettingsStore.read()
                .then(value => {
                    setSettings(value);
                    getMatches().then((matches) => {
                        // If there's a URL on the command line, open it
                        if (matches.args.url.value) {
                            setUrlString(matches.args.url.value.toString());
                        }
                        // Else, if there's a home URL in the settings, open it
                        else if (value.homeUrlString) {
                            setUrlString(value.homeUrlString)
                        }
                    })
                })
        }
        readSettings().catch(e => console.error(e));
        return () => {
            is_setup = true;
        }
    }, [])
    React.useEffect(() => {
        if (settings) {
            SettingsStore.write(settings).catch(e => console.error(e))
        }
    }, [settings])
    let needToLoadBookmarks = true;
    React.useEffect(() => {
        if (!needToLoadBookmarks) return;
        BookmarksStore.read()
            .then(value => {
                needToLoadBookmarks = false;
                setBookmarks(Bookmark.sortAndRenumber(value));
            })
        return () => {
            needToLoadBookmarks = false;
        }
    }, [])
    React.useEffect(() => {
        if (bookmarks) {
            BookmarksStore.write(bookmarks).catch(e => console.error(e));
            needToLoadBookmarks = true;
        }
    }, [bookmarks])
    React.useEffect(() => {
        if (urlString) {
            // If there's no protocol, make it gemini
            const split = urlString.split("://", 2);
            if (split.length < 2) {
                setUrlString(`gemini://${urlString}`)
            } else {
                makeRequest().catch(e => console.error(e));
            }
        }
    }, [urlString]);

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
    const saveDocument = () => {
        const getSuggestedFileName = (urlString: string, success: Success) => {
            // Remove trailing slash no matter what
            const suggestedFilename = Util.removeTrailingSlash(urlString);
            const suggestedExtension = success.isGemini() ? ".gmi" : success.isText() ? ".txt" : "";
            return suggestedExtension ? suggestedFilename.endsWith(suggestedExtension) ? suggestedFilename : `${suggestedFilename}${suggestedExtension}` : suggestedFilename;
        }
        if (success && success.body) {
            saveOctets(Util.toUrl(getSuggestedFileName(urlString, success)), success.body);
        }
    }
    const saveOctets = (url: URL, octets: number[]) => {
        const getSavePath = async (url: URL) => {
            const suggestedFilename = Util.removeTrailingSlash(url.toString());
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
        if (event.key === "Enter" && urlInputString.length !== 0) {
            event.preventDefault();
            doRequest();
        }
    }
    const doRequest = () => {
        setSuccess(undefined);
        setNoHistory(false);
        setUrlString(urlInputString);
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
            if (success.isGemini() || success.isTextLike() || success.isImage()) {
                setSuccess(success);
                if (success.isImage()) {
                    Tauri.base64_encode(success.body)
                        .then(data => {
                            setInlineImageSrc(`data:${success.mimeType?.toString()};base64,${data}`);
                        })
                }
            } else {
                setInfo(`Can't display MIME type "${success.mimeType}"\n`)
                saveDocument();
            }
        } else if (result.redirect) {
            const redirect = new Redirect(result.redirect);
            setNoHistory(!redirect.isPermanent());
            setUrlString(new URL(redirect.url, urlString).toString());
        } else if (result.failure) {
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
    const formatSuccess = (success: Success) => {
        if (success.isGemini()) return formatGeminiSuccess(success);
        if (success.isTextLike()) return formatPlainSuccess(success);
        return <></>
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
                preformattedChildren.push(<span key={index}>{line}<br/></span>);
            } else switch (geminiLine.type) {
                case LineType.Link:
                    const jimini_link = JiminiLink.parseString(geminiLine.text ?? "");
                    try {
                        const link = new URL(jimini_link.link, urlString);
                        let className = "link";
                        if (link.protocol !== "gemini:") className += " foreign-link";
                        lines.push(<div key={index}>
                            <a href={"#"} className={className} data-link={jimini_link.link}
                               onFocus={e => onLinkHover(e.target as HTMLElement, true)}
                               onBlur={e => onLinkHover(e.target as HTMLElement, false)}
                               onMouseEnter={e => onLinkHover(e.target as HTMLElement, true)}
                               onMouseLeave={e => onLinkHover(e.target as HTMLElement, false)}
                               onClick={e => onLinkClick(e.target as HTMLElement)}>
                                {jimini_link.name}
                            </a>
                        </div>);
                    } catch (e) {
                        console.error(e)
                        break; // This is so invalid URLs don't crash the app
                    }
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
    const addBookmark = () => {
        const isBookmarked = bookmarks.find(value => value.url === urlString)
        if (!isBookmarked) {
            setInfo("Added bookmark")
            bookmarks.push(new Bookmark(urlString));
            setBookmarks(bookmarks.slice());
        } else {
            setInfo("Bookmarked")
        }
        setTimeout(() => setInfo(""), 1500);
    }
    const removeBookmark = (bookmark: Bookmark) => {
        setBookmarks(bookmarks.filter(value => value.url != bookmark.url));
    }
    const home = () => {
        if (settings.homeUrlString === urlString) return;
        setUrlString(settings.homeUrlString)
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
    const onOpenUrl = (url: string) => {
        setUrlString(url);
        setShowBookmarkPanel(false);
    }
    const colorSchemeClass = () => {
        const colorScheme = settings.colorScheme == ColorScheme.SYSTEM ? Util.preferredColorScheme() : settings.colorScheme;
        return colorScheme == ColorScheme.DARK ? "dark-scheme" : "light-scheme"
    }
    const fontSizeClass = () => {
        if (settings.textSize == TextSize.SMALL) return "smaller-text";
        if (settings.textSize == TextSize.LARGE) return "larger-text";
        return "";
    }
    const wrapperClass = () => {
        const class1 = colorSchemeClass();
        const class2 = fontSizeClass();
        return class2 ? `${class1} ${class2}` : class1;
    }
    const isCurrentUrlBookmarked = () => {
        return bookmarks.find(bookmark => bookmark.url == urlString) != undefined;
    }
    return <div id={"wrapper"} className={wrapperClass()}>
        {showBookmarkPanel ?
            <BookmarkPanel bookmarks={bookmarks} setBookmarks={setBookmarks} removeBookmark={removeBookmark}
                           openUrl={onOpenUrl} cancel={() => setShowBookmarkPanel(false)}/> : <>
                <header>
                    <HamburgerMenu onSave={saveDocument} onSettings={() => setShowSettings(true)}
                                   onShowAbout={() => setShowAbout(true)}
                                   onShowBookmarkPanel={() => setShowBookmarkPanel(true)}
                    />
                    <button id={"home-button"} className={"nav-button"} onClick={home} title={"Open home page"}
                            disabled={settings.homeUrlString.length === 0}>{<svg viewBox="0 0 26 26">
                        <polygon
                            points="13,3 25,14 20,14 20,22 15,22 15,17 11,17 11,22 6,22 6,14 1,14"
                            strokeLinejoin="round"
                        />
                    </svg>}
                    </button>
                    <button id={"bookmark-button"} className={"nav-button"} onClick={addBookmark}
                            title={"Bookmark current page"}
                            disabled={isCurrentUrlBookmarked()}>{<svg viewBox="0 0 26 26">
                        <polygon
                            points="19,24 13,16 7,24 7,3 19,3"
                            strokeLinejoin="round"
                        />
                    </svg>}
                    </button>
                    <button id="previous-button" className="nav-button" onClick={previous} title={"Previous"}
                            disabled={!urlHistory.hasPreviousUrl()}>{<svg viewBox="0 0 26 26">
                        <use href="#triangle" transform="rotate(-90, 13, 13)"/>
                    </svg>}
                    </button>
                    <button id="next-button" className="nav-button" onClick={next} title={"Next"}
                            disabled={!urlHistory.hasNextUrl()}>{<svg
                        viewBox="0 0 26 26">
                        <use href="#triangle" transform="rotate(90, 13, 13)"/>
                    </svg>}</button>
                    <input type="text" placeholder="Gemini URL" id="gemini-url-input"
                           value={urlInputString}
                           onChange={e => setUrlInputString(e.target.value)}
                           onKeyUp={onUrlKeyUp}
                    />
                    <button onClick={doRequest} disabled={urlInputString.length === 0}>Go</button>
                </header>
                <div className="container">
                    {loading && <div className="loading">Loading...</div>}
                    {info && <p id={"info"}>{info}</p>}
                    {geminiError && <p id="gemini_error">{geminiError}</p>}
                    {success && formatSuccess(success)}
                    {inlineImageSrc && <img alt={urlString} src={inlineImageSrc}/>}
                </div>
                <footer>{footer}</footer>
            </>}
        <InputDialog
            isOpen={promptForInput || promptForSensitiveInput}
            onInput={onInput}
            onCancel={onInputCancel}
            dialogContent={dialogContent}
            isSensitive={promptForSensitiveInput}
        />
        <AboutDialog isOpen={showAbout} onCancel={() => setShowAbout(false)}/>
        <SettingsDialog
            isOpen={showSettings}
            settings={settings}
            urlString={urlString}
            onChangeSettings={setSettings}
            onCancel={() => setShowSettings(false)}/>
        <svg className="symbol-set">
            <symbol id="triangle">
                <polygon
                    points="13,3 25,19 1,19"
                    strokeLinejoin="round"
                />
            </symbol>
            <symbol id="x">
                <line x1="3" y1="3" x2="22" y2="22"
                      strokeLinecap="round"
                />
                <line x1="22" y1="3" x2="3" y2="22"
                      strokeLinecap="round"
                />
            </symbol>
        </svg>
    </div>;
}

export default App;
