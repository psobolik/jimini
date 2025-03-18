import React from "react";
import {ColorScheme} from "../Data/Settings.ts";

interface ColorSchemePickerProps {
    onColorSchemeChange: (newColorScheme: ColorScheme) => void;
    colorScheme: ColorScheme;
}

const ColorSchemePicker: React.FunctionComponent<ColorSchemePickerProps> = (props) => {
    return <fieldset>
        <legend>Theme</legend>
        <div>
            <input type="radio"
                   id="light-color-scheme"
                   name="colorScheme"
                   value={ColorScheme.LIGHT}
                   onChange={(event) => props.onColorSchemeChange(Number(event.target.value))}
                   checked={props.colorScheme === ColorScheme.LIGHT}
            />
            <label htmlFor="light-color-scheme">Light</label>
        </div>
        <div>
            <input type="radio"
                   id="dark-color-scheme"
                   name="colorScheme"
                   value={ColorScheme.DARK}
                   onChange={(event) => props.onColorSchemeChange(Number(event.target.value))}
                   checked={props.colorScheme === ColorScheme.DARK}
            />
            <label htmlFor="dark-color-scheme">Dark</label>
        </div>
        <div>
            <input type="radio"
                   id="system-color-scheme"
                   name="colorScheme"
                   value={ColorScheme.SYSTEM}
                   onChange={(event) => props.onColorSchemeChange(Number(event.target.value))}
                   checked={props.colorScheme === ColorScheme.SYSTEM}
            />
            <label htmlFor="system-color-scheme">System</label>
        </div>
    </fieldset>
}
export default ColorSchemePicker;