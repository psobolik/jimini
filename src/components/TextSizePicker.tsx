import React from "react";
import {TextSize} from "../Data/Settings.ts";
import LabeledRadioButton from "./LabeledRadioButton.tsx";

interface TextSizePickerProps {
    onTextSizeChange: (newTextSize: TextSize) => void;
    textSize: TextSize;
}

const TextSizePicker: React.FunctionComponent<TextSizePickerProps> = (props) => {
    return <fieldset>
        <legend>Text Size</legend>
        <LabeledRadioButton
            label={"Small"}
            id={"text-size-small"}
            name={"textSize"}
            value={TextSize.SMALL}
            checked={props.textSize === TextSize.SMALL}
            setChecked={value => props.onTextSizeChange(value)}
        />
        <LabeledRadioButton
            label={"Medium"}
            id={"text-size-medium"}
            name={"textSize"}
            value={TextSize.MEDIUM}
            checked={props.textSize === TextSize.MEDIUM}
            setChecked={value => props.onTextSizeChange(value)}
        />
        <LabeledRadioButton
            label={"Large"}
            id={"text-size-large"}
            name={"textSize"}
            value={TextSize.LARGE}
            checked={props.textSize === TextSize.LARGE}
            setChecked={value => props.onTextSizeChange(value)}
        />
    </fieldset>
}

export default TextSizePicker;