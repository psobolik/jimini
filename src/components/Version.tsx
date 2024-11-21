import React from "react";
import Tauri from "../Tauri.ts";

const Version: React.FunctionComponent = () => {
    const [version, setVersion] = React.useState<string>("");

    React.useEffect(() => {
        if (version) return;
        Tauri.version().then(setVersion);
    }, [])
    return <div>Version {version}</div>
}

export default Version;