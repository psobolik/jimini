import "../styles/SettingsDialog.css"
import React from "react"
import {ColorScheme, Settings, TextSize} from "../Data/Settings.ts";

interface SettingsDialogProps {
    settings: Settings;
    onChangeSettings: (Settings) => void;
    urlString: string;
    isOpen: boolean;
    onCancel: () => void;
}

const SettingsDialog: React.FunctionComponent<SettingsDialogProps> = (props) => {
    const [showDialog, setShowDialog] = React.useState<boolean>(false);
    const [settings, setSettings] = React.useState<Settings>(props.settings);

    const modalRef = React.createRef<HTMLDialogElement>();

    React.useEffect(() => {
        setSettings(props.settings)
    }, [props.settings])
    React.useEffect(() => {
        setShowDialog(props.isOpen)
    }, [props.isOpen])
    // Show/hide the dialog to match the current modelOpen state
    React.useEffect(() => {
        if (!modalRef.current) return;
        if (showDialog) {
            modalRef.current.showModal();
        } else {
            modalRef.current.close();
        }
    }, [showDialog])
    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') cancel();
    }
    const cancel = () => {
        if (props.onCancel) props.onCancel();
        setShowDialog(false);
    }
    const onTextSizeChange = (evt) => {
        if (props.settings.textSize == evt.target.value) return;

        let newSettings = new Settings(settings.colorScheme, settings.homeUrlString, evt.target.value);
        setSettings(newSettings);
        props.onChangeSettings(newSettings);
    }
    const onColorSchemeChange = (evt) => {
        if (props.settings.colorScheme == evt.target.value) return;

        let newSettings = new Settings(evt.target.value, settings.homeUrlString, settings.textSize);
        setSettings(newSettings);
        props.onChangeSettings(newSettings);
    }
    const setHomeUrlString = (value) => {
        if (props.settings.homeUrlString == value) return;

        let newSettings = new Settings(settings.colorScheme, value, settings.textSize);
        setSettings(newSettings);
        props.onChangeSettings(newSettings);
    }
    const onHomeChanged = (evt) => {
        setHomeUrlString(evt.target.value);
    }
    const onClearHome = () => {
        setHomeUrlString("");
    }
    const onUseCurrentHome = () => {
        setHomeUrlString(props.urlString);
    }
    return <dialog id={"settings-dialog"}
                   ref={modalRef}
                   onKeyDown={onKeyDown}>
        <div style={{display: "grid", gridTemplateColumns: "auto auto"}}>
            <fieldset>
                <legend>Theme</legend>
                <div>
                    <input type="radio"
                           id="light-color-scheme"
                           name="colorScheme"
                           value={ColorScheme.LIGHT}
                           onChange={onColorSchemeChange}
                           checked={settings.colorScheme == ColorScheme.LIGHT}/>
                    <label htmlFor="light-color-scheme">Light</label>
                </div>
                <div>
                    <input type="radio"
                           id="dark-color-scheme"
                           name="colorScheme"
                           value={ColorScheme.DARK}
                           onChange={onColorSchemeChange}
                           checked={settings.colorScheme == ColorScheme.DARK}/>
                    <label htmlFor="dark-color-scheme">Dark</label>
                </div>
                <div>
                    <input type="radio"
                           id="system-color-scheme"
                           name="colorScheme"
                           value={ColorScheme.SYSTEM}
                           onChange={onColorSchemeChange}
                           checked={settings.colorScheme == ColorScheme.SYSTEM}/>
                    <label htmlFor="system-color-scheme">System</label>
                </div>
            </fieldset>
            <fieldset>
                <legend>Text Size</legend>
                <div>
                    <input type="radio"
                           id="text-size-small"
                           name="textSize"
                           value={TextSize.SMALL}
                           onChange={onTextSizeChange}
                           checked={settings.textSize == TextSize.SMALL}/>
                    <label htmlFor="text-size-small">Small</label>
                </div>
                <div>
                    <input type="radio"
                           id="text-size-medium"
                           name="textSize"
                           value={TextSize.MEDIUM}
                           onChange={onTextSizeChange}
                           checked={settings.textSize == TextSize.MEDIUM}/>
                    <label htmlFor="text-size-medium">Medium</label>
                </div>
                <div>
                    <input type="radio"
                           id="text-size-large"
                           name="textSize"
                           value={TextSize.LARGE}
                           onChange={onTextSizeChange}
                           checked={settings.textSize == TextSize.LARGE}/>
                    <label htmlFor="text-size-large">Large</label>
                </div>
            </fieldset>
        </div>
        <fieldset>
            <legend>Home Capsule</legend>
            <div>
                <input type={"text"}
                       id={"blank-home-page"}
                       value={settings.homeUrlString ?? ""}
                       onChange={onHomeChanged}
                       checked={!settings.homeUrlString}/>
                <a href={"#"} onClick={onUseCurrentHome}>Use Current</a>
                <a href={"#"} onClick={onClearHome}>Clear</a>
            </div>
        </fieldset>
        <div className={"button-container"}>
            <button onClick={cancel}>Done</button>
        </div>
    </dialog>
}
export default SettingsDialog;
