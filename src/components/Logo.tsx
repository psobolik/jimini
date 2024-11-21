import React from "react";

const Logo: React.FunctionComponent = () => {
    const LogoLines = [
        "",
        "       _   _               _           _",
        "      {_} {_}             {_}         {_}",
        "       _   _   _ __ ___    _   _ __    _ ",
        "      | | | | | '_ ` _ \\  | | | '_ \\  | |",
        "      | | | | | | | | | | | | | | | | | |",
        "  _   | | |_| |_| |_| |_| |_| |_| |_| |_|",
        " | |__| |",
        "  \\____/        A Gemini Protocol Browser  ",
        "",
    ];

    const markup = LogoLines.map((logoLine, index) => {
        return <div key={index}>{logoLine}</div>
    })
    return <pre>{markup}</pre>
}
export default Logo;
