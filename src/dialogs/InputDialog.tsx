import React from "react";

interface InputDialogProps {
    isOpen: boolean;
    onInput: (input: string) => void;
    onCancel: () => void;
    dialogContent: React.ReactNode;
    isSensitive: boolean;
}

const InputDialog: React.FunctionComponent<InputDialogProps> = (props) => {
    const [showOpen, setShowOpen] = React.useState<boolean>(false);
    const [inputText, setInputText] = React.useState<string>("");

    const modalRef = React.createRef<HTMLDialogElement>();

    // Set the modalOpen state to match the current isOpen property
    React.useEffect(() => {
        setShowOpen(props.isOpen);
    }, [props.isOpen]);

    // Show/hide the dialog to match the current modelOpen state
    React.useEffect(() => {
        if (!modalRef.current) return;
        if (showOpen) {
            modalRef.current.showModal();
        } else {
            modalRef.current.close();
        }
    }, [showOpen])

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
        if (props.onCancel) props.onCancel();
        setShowOpen(false);
    }
    const ok = () => {
        // The caller will close the dialog if the input is acceptable
        props.onInput(inputText);
    }

    return <dialog
        ref={modalRef}
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
    </dialog>
}
export default InputDialog;
