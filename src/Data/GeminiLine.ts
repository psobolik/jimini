export enum LineType {
    Text,
    Link,
    PreformatToggle,
    Heading1,
    Heading2,
    Heading3,
    ListItem,
    Quote
}
export default class GeminiLine {
    type: LineType;
    text: string | undefined;

    constructor(type: LineType, text: string | undefined) {
        this.type = type;
        this.text = text;
    }

    static parseLine = (line: string): GeminiLine => {
        if (line.startsWith("```")) {
            return new GeminiLine(LineType.PreformatToggle, undefined);
        }
        if (line.startsWith("###")) {
            return new GeminiLine(LineType.Heading3, line.slice(3));
        }
        if (line.startsWith("##")) {
            return new GeminiLine(LineType.Heading2, line.slice(2));
        }
        if (line.startsWith("#")) {
            return new GeminiLine(LineType.Heading1, line.slice(1));
        }
        if (line.startsWith("=>")) {
            return new GeminiLine(LineType.Link, line.slice(2));
        }
        if (line.startsWith(">")) {
            return new GeminiLine(LineType.Quote, line.slice(1));
        }
        if (line.startsWith("*")) {
            return new GeminiLine(LineType.ListItem, line.slice(1));
        }
        return new GeminiLine(LineType.Text, line);
    }
}
