import "../styles/SettingsDialog.css"
import React from "react"
import {ColorScheme, Settings, TextSize} from "../Data/Settings.ts";
import ClosePanel from "../components/ClosePanel.tsx";
import ColorSchemePicker from "../components/ColorSchemePicker.tsx";
import TextSizePicker from "../components/TextSizePicker.tsx";
import HomeCapsuleSelector from "../components/HomeCapsuleSelector.tsx";

interface SettingsDialogPanelProps {
    settings: Settings;
    onChangeSettings: (settings: Settings) => void;
    urlString: string;
    onCancel: () => void;
}

const SettingsDialogPanel: React.FunctionComponent<SettingsDialogPanelProps> = (props) => {
    const [settings, setSettings] = React.useState<Settings>(props.settings);

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') cancel();
    }
    const cancel = () => {
        props.onCancel();
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
    return <span id={"settings-dialog"}
                 onKeyDown={onKeyDown}>
        <ClosePanel onClose={cancel}/>
        <div style={{display: "grid", gridTemplateColumns: "auto auto"}}>
            <ColorSchemePicker onColorSchemeChange={onColorSchemeChange} colorScheme={settings.colorScheme}/>
            <TextSizePicker onTextSizeChange={onTextSizeChange} textSize={settings.textSize}/>
        </div>
        <HomeCapsuleSelector home={settings.homeUrlString} current={props.urlString} onSelectHome={setHomeUrlString}/>
    </span>
}
export default SettingsDialogPanel;
