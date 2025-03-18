import React from "react";

interface HomeCapsuleSelectorProps {
    home: string;
    current: string;
    onSelectHome: (newHome: string) => void;
}

const HomeCapsuleSelector: React.FunctionComponent<HomeCapsuleSelectorProps> = (props) => {
    return <fieldset>
        <legend>Home Capsule</legend>
        <div>
            <input type={"text"}
                   id={"blank-home-page"}
                   value={props.home}
                   onChange={event => props.onSelectHome(event.target.value)}
                   checked={!props.home}/>
            <a href={"#"} onClick={() => props.onSelectHome(props.current)}>Use Current</a>
            <a href={"#"} onClick={() => props.onSelectHome("")}>Clear</a>
        </div>
    </fieldset>
}

export default HomeCapsuleSelector;
