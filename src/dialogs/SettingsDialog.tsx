import "../styles/SettingsDialog.css"
import React from "react"
import {ColorScheme, Settings, TextSize} from "../Data/Settings.ts";
import ClosePanel from "../components/ClosePanel.tsx";
import ColorSchemePicker from "../components/ColorSchemePicker.tsx";
import TextSizePicker from "../components/TextSizePicker.tsx";
import HomeCapsuleSelector from "../components/HomeCapsuleSelector.tsx";

interface SettingsDialogProps {
    settings: Settings;
    onChangeSettings: (settings: Settings) => void;
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
        props.onCancel();
        setShowDialog(false);
    }
    const onTextSizeChange = (newTextSize: TextSize) => {
        if (props.settings.textSize == newTextSize) return;

        let newSettings = new Settings(settings.colorScheme, settings.homeUrlString, newTextSize);
        setSettings(newSettings);
        props.onChangeSettings(newSettings);
    }
    const onColorSchemeChange = (newColorScheme: ColorScheme) => {
        if (props.settings.colorScheme == newColorScheme) return;

        let newSettings = new Settings(newColorScheme, settings.homeUrlString, settings.textSize);
        setSettings(newSettings);
        props.onChangeSettings(newSettings);
    }
    const setHomeUrlString = (value: string) => {
        if (props.settings.homeUrlString == value) return;

        let newSettings = new Settings(settings.colorScheme, value, settings.textSize);
        setSettings(newSettings);
        props.onChangeSettings(newSettings);
    }
    return <dialog className={"with-close-panel"} id={"settings-dialog"}
                   ref={modalRef}
                   onKeyDown={onKeyDown}>
        <ClosePanel onClose={cancel}/>
        <div style={{display: "grid", gridTemplateColumns: "auto auto"}}>
            <ColorSchemePicker onColorSchemeChange={onColorSchemeChange} colorScheme={settings.colorScheme}/>
            <TextSizePicker onTextSizeChange={onTextSizeChange} textSize={settings.textSize}/>
        </div>
        <HomeCapsuleSelector home={settings.homeUrlString} current={props.urlString} onSelectHome={setHomeUrlString}/>
    </dialog>
}
export default SettingsDialog;
