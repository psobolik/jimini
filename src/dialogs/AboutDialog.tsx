import React from "react";
import Logo from "../components/Logo.tsx";
import Version from "../components/Version.tsx";
import Copyright from "../components/Copyright";

interface AboutDialogProps {
    isOpen: boolean;
    onCancel: () => void;
}

const AboutDialog: React.FunctionComponent<AboutDialogProps> = (props) => {
    const [showAbout, setShowAbout] = React.useState<boolean>(false);

    const modalRef = React.createRef<HTMLDialogElement>();

    // Set the modalOpen state to match the current isOpen property
    React.useEffect(() => {
        setShowAbout(props.isOpen);
    }, [props.isOpen]);

    // Show/hide the dialog to match the current modelOpen state
    React.useEffect(() => {
        if (!modalRef.current) return;
        if (showAbout) {
            modalRef.current.showModal();
        } else {
            modalRef.current.close();
        }
    }, [showAbout])

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') cancel();
    }
    const cancel = () => {
        if (props.onCancel) props.onCancel();
        setShowAbout(false);
    }

    return <dialog
        id={"about-dialog"}
        ref={modalRef}
        onKeyDown={onKeyDown}>
        <Logo/>
        <Version/>
        <Copyright/>
        <div className={"button-container"}>
            <button onClick={cancel}>OK</button>
        </div>
    </dialog>
}
export default AboutDialog;
