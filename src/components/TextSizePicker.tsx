import React from "react";
import {TextSize} from "../Data/Settings.ts";

interface TextSizePickerProps {
    onTextSizeChange: (newTextSize: TextSize) => void;
    textSize: TextSize;
}

const TextSizePicker: React.FunctionComponent<TextSizePickerProps> = (props) => {
    const [textSize, setTextSize] = React.useState<TextSize>(props.textSize);

    React.useEffect(() => {
        props.onTextSizeChange(textSize);
    }, [textSize])
    React.useEffect(() => {
        setTextSize(props.textSize)
    }, [props.textSize])
    const onTextSizeChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        setTextSize(Number(evt.target.value))
    }

    return <fieldset>
        <legend>Text Size</legend>
        <div>
            <input type="radio"
                   id="text-size-small"
                   name="textSize"
                   value={TextSize.SMALL}
                   onChange={onTextSizeChange}
                   checked={textSize == TextSize.SMALL}/>
            <label htmlFor="text-size-small">Small</label>
        </div>
        <div>
            <input type="radio"
                   id="text-size-medium"
                   name="textSize"
                   value={TextSize.MEDIUM}
                   onChange={onTextSizeChange}
                   checked={textSize == TextSize.MEDIUM}/>
            <label htmlFor="text-size-medium">Medium</label>
        </div>
        <div>
            <input type="radio"
                   id="text-size-large"
                   name="textSize"
                   value={TextSize.LARGE}
                   onChange={onTextSizeChange}
                   checked={textSize == TextSize.LARGE}/>
            <label htmlFor="text-size-large">Large</label>
        </div>
    </fieldset>
}

export default TextSizePicker;