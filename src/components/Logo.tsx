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
        return <span key={index}>{logoLine}<br/></span>
    })
    return <pre>{markup}</pre>
}
export default Logo;
