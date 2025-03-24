import React from "react";

interface LabeledRadioButtonProps {
    label: string;
    id: string;
    name: string;
    value: number;
    checked: boolean;
    setChecked: (value: number) => void;
}

const LabeledRadioButton: React.FunctionComponent<LabeledRadioButtonProps> = (props) => {
    return <div>
        <input
            id={props.id}
            name={props.name}
            value={props.value}
            type="radio"
            checked={props.checked}
            onChange={e => props.setChecked(Number(e.target.value))}/>
        <label
            htmlFor={props.id}>{props.label}
        </label>
    </div>
}
export default LabeledRadioButton;