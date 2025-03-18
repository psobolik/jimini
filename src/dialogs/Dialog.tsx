import React from "react";

interface DialogProps {
    isOpen: boolean;
    dialogClassName?: string;
    content: React.ReactElement;
}

const Dialog: React.FunctionComponent<DialogProps> = (props) => {
    const [showOpen, setShowOpen] = React.useState<boolean>(false);

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

    return <dialog
        ref={modalRef}
        className={props.dialogClassName}>
        {props.content}
    </dialog>
}
export default Dialog;