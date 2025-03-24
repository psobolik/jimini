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
    const [textSize, setTextSize] = React.useState<TextSize>(props.settings.textSize);
    const [colorScheme, setColorScheme] = React.useState<ColorScheme>(props.settings.colorScheme);
    const [homeUrlString, setHomeUrlString] = React.useState<string>(props.settings.homeUrlString);

    React.useEffect(() => {
        setTextSize(props.settings.textSize);
        setColorScheme(props.settings.colorScheme);
        setHomeUrlString(props.settings.homeUrlString);
    }, [props.settings])

    React.useEffect(() => {
        let newSettings = new Settings(colorScheme, homeUrlString, textSize);
        props.onChangeSettings(newSettings);
    }, [textSize, colorScheme, homeUrlString])

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') cancel();
    }

    const cancel = () => {
        props.onCancel();
    }

    return <span id={"settings-dialog"}
                 onKeyDown={onKeyDown}>
        <ClosePanel onClose={cancel}/>
        <div style={{display: "grid", gridTemplateColumns: "auto auto"}}>
            <ColorSchemePicker onColorSchemeChange={setColorScheme} colorScheme={colorScheme}/>
            <TextSizePicker onTextSizeChange={setTextSize} textSize={textSize}/>
        </div>
        <HomeCapsuleSelector onSelectHome={setHomeUrlString} home={homeUrlString} current={props.urlString}/>
    </span>
}
export default SettingsDialogPanel;
