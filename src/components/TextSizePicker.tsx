import React from "react";
import {TextSize} from "../Data/Settings.ts";

interface TextSizePickerProps {
    onTextSizeChange: (newTextSize: TextSize) => void;
    textSize: TextSize;
}

const TextSizePicker: React.FunctionComponent<TextSizePickerProps> = (props) => {
    return <fieldset>
        <legend>Text Size</legend>
        <div>
            <input type="radio"
                   id="text-size-small"
                   name="textSize"
                   value={TextSize.SMALL}
                   onChange={event => props.onTextSizeChange(Number(event.target.value))}
                   checked={props.textSize == TextSize.SMALL}/>
            <label htmlFor="text-size-small">Small</label>
        </div>
        <div>
            <input type="radio"
                   id="text-size-medium"
                   name="textSize"
                   value={TextSize.MEDIUM}
                   onChange={event => props.onTextSizeChange(Number(event.target.value))}
                   checked={props.textSize == TextSize.MEDIUM}/>
            <label htmlFor="text-size-medium">Medium</label>
        </div>
        <div>
            <input type="radio"
                   id="text-size-large"
                   name="textSize"
                   value={TextSize.LARGE}
                   onChange={event => props.onTextSizeChange(Number(event.target.value))}
                   checked={props.textSize == TextSize.LARGE}/>
            <label htmlFor="text-size-large">Large</label>
        </div>
    </fieldset>
}

export default TextSizePicker;