import React from "react";
import {ColorScheme} from "../Data/Settings.ts";
import LabeledRadioButton from "./LabeledRadioButton.tsx";

interface ColorSchemePickerProps {
    onColorSchemeChange: (newColorScheme: ColorScheme) => void;
    colorScheme: ColorScheme;
}

const ColorSchemePicker: React.FunctionComponent<ColorSchemePickerProps> = (props) => {
    return <fieldset>
        <legend>Theme</legend>
        <LabeledRadioButton
            label={"Light"}
            id={"light-color-scheme"}
            name={"colorScheme"}
            value={ColorScheme.LIGHT}
            checked={props.colorScheme === ColorScheme.LIGHT}
            setChecked={value => {props.onColorSchemeChange(value)}}
        />
        <LabeledRadioButton
            label={"Dark"}
            id={"dark-color-scheme"}
            name={"colorScheme"}
            value={ColorScheme.DARK}
            checked={props.colorScheme === ColorScheme.DARK}
            setChecked={value => {props.onColorSchemeChange(value)}}
        />
        <LabeledRadioButton
            label={"System"}
            id={"system-color-scheme"}
            name={"colorScheme"}
            value={ColorScheme.SYSTEM}
            checked={props.colorScheme === ColorScheme.SYSTEM}
            setChecked={value => {props.onColorSchemeChange(value)}}
        />
    </fieldset>
}
export default ColorSchemePicker;