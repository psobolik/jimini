import "./styles/App.css";
import React from "react";
import Tauri from "./Tauri.ts";
import {getMatches} from "@tauri-apps/plugin-cli";
import {downloadDir} from "@tauri-apps/api/path";
import {save} from "@tauri-apps/plugin-dialog";
import {writeFile} from "@tauri-apps/plugin-fs";
import Certificate from "./Data/Certificate.ts";
import Redirect from "./Data/Redirect.ts";
import Failure from "./Data/Failure.ts";
import Success from "./Data/Success.ts"
import GeminiResponse from "./Data/GeminiResponse.ts";
import Prompt from "./Data/Prompt.ts";
import {ColorScheme, Settings, TextSize} from "./Data/Settings.ts";
import SettingsStore from "./Stores/SettingsStore.ts"
import Util from "./Util.ts";
import UrlHistory from "./UrlHistory.ts";
import InputDialogPanel from "./dialogs/InputDialogPanel.tsx";
import AboutDialogPanel from "./dialogs/AboutDialogPanel.tsx";
import SettingsDialogPanel from "./dialogs/SettingsDialogPanel.tsx";
import BookmarkPanel from "./components/BookmarkPanel.tsx";
import BookmarksStore from "./Stores/BookmarksStore.ts";
import Bookmark from "./Data/Bookmark.ts";
import Header from "./components/Header.tsx";
import Dialog from "./dialogs/Dialog.tsx";
import SuccessDocument from "./components/documents/SuccessDocument.tsx";
import InfoPanel from "./components/InfoPanel.tsx";

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
    let initialized = false;
    React.useEffect(() => {
        if (initialized) return;

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
            }).catch(e => console.error(e));
        return () => {
            initialized = true
        }
    }, [])
    React.useEffect(() => {
        if (settings) {
            SettingsStore.write(settings).catch(e => console.error(e))
        }
    }, [settings])
    React.useEffect(() => {
        BookmarksStore.read()
            .then(value => {
                setBookmarks(Bookmark.sortAndRenumber(value));
            })
    }, [])
    React.useEffect(() => {
        if (bookmarks) {
            BookmarksStore.write(bookmarks).catch(e => console.error(e));
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
    const saveSuccessBody = (success: Success) => {
        if (success && success.body) {
            const suggestedFileName = Util.removeTrailingSlash(urlString);
            saveOctets(Util.toUrl(suggestedFileName), success.body);
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
                    writeFile(savePath, Uint8Array.from(octets)).then();
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
            openInputUrl();
        }
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
                saveSuccessBody(success);
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
    const updateBookmarks = (bookmarks: Bookmark[]) => setBookmarks(Bookmark.sortAndRenumber(bookmarks));
    const addBookmark = () => {
        if (!bookmarks.find(value => value.url === urlString)) {
            setInfo("Added bookmark")
            bookmarks.push(new Bookmark(urlString));
            updateBookmarks(bookmarks);
        } else {
            setInfo("Bookmarked")
        }
        setTimeout(() => setInfo(""), 1500);
    }
    const removeBookmark = (bookmark: Bookmark) => updateBookmarks(bookmarks.filter(value => value.url != bookmark.url))
    const openUrl = (url: string, withNoHistory: boolean = false) => {
        if (urlString === url) return;
        setNoHistory(withNoHistory);
        setUrlString(url);
    }
    const openInputUrl = () => openUrl(urlInputString);
    const home = () => openUrl(settings.homeUrlString)
    const openBookmarkUrl = (url: string) => {
        setShowBookmarkPanel(false);
        openUrl(url);
    }
    const previous = () => {
        let previousUrl = urlHistory.previousUrl();
        if (previousUrl) openUrl(previousUrl.toString(), true);
    }
    const next = () => {
        let nextUrl = urlHistory.nextUrl();
        if (nextUrl) openUrl(nextUrl.toString(), true);
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
    const wrapperClass = () => {
        const colorSchemeClass = () => {
            const colorScheme = settings.colorScheme == ColorScheme.SYSTEM ? Util.preferredColorScheme() : settings.colorScheme;
            return colorScheme == ColorScheme.DARK ? "dark-scheme" : "light-scheme"
        }
        const fontSizeClass = () => {
            if (settings.textSize == TextSize.SMALL) return "smaller-text";
            if (settings.textSize == TextSize.LARGE) return "larger-text";
            return "";
        }
        const colorScheme = colorSchemeClass();
        const fontSize = fontSizeClass();
        return fontSize ? `${colorScheme} ${fontSize}` : colorScheme;
    }
    const isCurrentUrlBookmarked = () => {
        return bookmarks.find(bookmark => bookmark.url == urlString) != undefined;
    }
    return <div id={"wrapper"} className={wrapperClass()}>
        {showBookmarkPanel ?
            <BookmarkPanel bookmarks={bookmarks} updateBookmarks={updateBookmarks} removeBookmark={removeBookmark}
                           openUrl={openBookmarkUrl} cancel={() => setShowBookmarkPanel(false)}/> : <>
                <Header
                    saveDocument={saveDocument}
                    showSettings={() => setShowSettings(true)}
                    showAbout={() => setShowAbout(true)}
                    showBookmarks={() => setShowBookmarkPanel(true)}
                    canGoHome={settings.homeUrlString.length !== 0}
                    goHome={home}
                    canAddBookmark={!isCurrentUrlBookmarked()}
                    addBookmark={addBookmark}
                    canShowPrevious={urlHistory.hasPreviousUrl()}
                    showPrevious={previous}
                    canShowNext={urlHistory.hasNextUrl()}
                    showNext={next}
                    url={urlInputString}
                    canOpenUrl={urlInputString.length === 0}
                    openUrl={openInputUrl}
                    setUrl={url => setUrlInputString(url)}
                    onUrlKeyUp={onUrlKeyUp}
                />
                <div className="container">
                    <InfoPanel hidden={!loading} text={"Loading..."} id={"loading"}/>
                    <InfoPanel hidden={info === ""} text={info} id={"info"}/>
                    <InfoPanel hidden={geminiError === ""} text={geminiError} id={"gemini_error"}/>
                    <SuccessDocument
                        hidden={success === undefined}
                        success={success}
                        baseUrl={urlInputString}
                        setLink={setFooter}
                        openUrl={url => openUrl(url.toString(), false)}/>
                    {inlineImageSrc && <img alt={urlString} src={inlineImageSrc}/>}
                </div>
                <footer>{footer}</footer>
            </>}
        <Dialog
            isOpen={promptForInput || promptForSensitiveInput} content={<InputDialogPanel
            onInput={onInput}
            onCancel={onInputCancel}
            dialogContent={dialogContent}
            isSensitive={promptForSensitiveInput}
        />}
        />
        <Dialog
            isOpen={showAbout}
            content={<AboutDialogPanel onCancel={() => setShowAbout(false)}/>}
        />
        <Dialog
            isOpen={showSettings}
            content={<SettingsDialogPanel
                settings={settings}
                urlString={urlString}
                onChangeSettings={setSettings}
                onCancel={() => setShowSettings(false)}
            />}
        />
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
