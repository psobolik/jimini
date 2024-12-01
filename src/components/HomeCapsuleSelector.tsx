import React from "react";

interface HomeCapsuleSelectorProps {
    home: string;
    current: string;
    onSelectHome: (newHome: string) => void;
}

const HomeCapsuleSelector: React.FunctionComponent<HomeCapsuleSelectorProps> = (props) => {
    const [home, setHome] = React.useState<string>(props.home);

    React.useEffect(() => {
        props.onSelectHome(home);
    }, [home])
    React.useEffect(() => {
        setHome(props.home)
    }, [props.home])
    const onHomeChanged = (evt: React.ChangeEvent<HTMLInputElement>) => {
        setHome(evt.target.value);
    }
    const onClearHome = () => {
        setHome("");
    }
    function onUseCurrentHome() {
        setHome(props.current)
    }

    return <fieldset>
        <legend>Home Capsule</legend>
        <div>
            <input type={"text"}
                   id={"blank-home-page"}
                   value={home}
                   onChange={onHomeChanged}
                   checked={!home}/>
            <a href={"#"} onClick={onUseCurrentHome}>Use Current</a>
            <a href={"#"} onClick={onClearHome}>Clear</a>
        </div>
    </fieldset>
}

export default HomeCapsuleSelector;