import React from "react";

interface InputDialogPanelProps {
    onInput: (input: string) => void;
    onCancel: () => void;
    dialogContent: React.ReactNode;
    isSensitive: boolean;
}

const InputDialogPanel: React.FunctionComponent<InputDialogPanelProps> = (props) => {
    const [inputText, setInputText] = React.useState<string>("");

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') cancel();
    }
    const onInputKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            ok();
        }
    }
    const cancel = () => {
        props.onCancel();
    }
    const ok = () => {
        // The caller will close the dialog if the input is acceptable
        props.onInput(inputText);
    }

    return <span
        onKeyDown={onKeyDown}>
        {props.dialogContent}
        <input id={"input-input"}
               type={props.isSensitive ? "password" : "text"}
               value={inputText}
               onKeyDown={onInputKeyDown}
               onChange={e => setInputText(e.target.value)}
               onFocus={(e) => {
                   e.target.select();
               }}
        />
        <div className={"button-container"}>
            <button onClick={ok}>OK</button>
            <button onClick={cancel}>Cancel</button>
        </div>
    </span>
}
export default InputDialogPanel;
