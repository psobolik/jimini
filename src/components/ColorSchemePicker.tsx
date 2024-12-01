import React, {useState} from "react";
import {ColorScheme} from "../Data/Settings.ts";

interface ColorSchemePickerProps {
    onColorSchemeChange: (newColorScheme: ColorScheme) => void;
    colorScheme: ColorScheme;
}

const ColorSchemePicker: React.FunctionComponent<ColorSchemePickerProps> = (props) => {
    const [colorScheme, setColorScheme] = useState<ColorScheme>(props.colorScheme);

    React.useEffect(() => {
        props.onColorSchemeChange(colorScheme);
    }, [colorScheme]);
    React.useEffect(() => {
        setColorScheme(props.colorScheme)
    }, [props.colorScheme])

    const onColorSchemeChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        setColorScheme(Number(evt.target.value));
    }

    return <fieldset>
        <legend>Theme</legend>
        <div>
            <input type="radio"
                   id="light-color-scheme"
                   name="colorScheme"
                   value={ColorScheme.LIGHT}
                   onChange={onColorSchemeChange}
                   checked={colorScheme == ColorScheme.LIGHT}/>
            <label htmlFor="light-color-scheme">Light</label>
        </div>
        <div>
            <input type="radio"
                   id="dark-color-scheme"
                   name="colorScheme"
                   value={ColorScheme.DARK}
                   onChange={onColorSchemeChange}
                   checked={colorScheme == ColorScheme.DARK}/>
            <label htmlFor="dark-color-scheme">Dark</label>
        </div>
        <div>
            <input type="radio"
                   id="system-color-scheme"
                   name="colorScheme"
                   value={ColorScheme.SYSTEM}
                   onChange={onColorSchemeChange}
                   checked={colorScheme == ColorScheme.SYSTEM}/>
            <label htmlFor="system-color-scheme">System</label>
        </div>
    </fieldset>
}
export default ColorSchemePicker;