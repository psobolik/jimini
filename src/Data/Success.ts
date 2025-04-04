import Util from "../Util.ts";
import GeminiMimeType from "./GeminiMimeType.ts";
import GeminiLine, {LineType} from "./GeminiLine.ts";
import JiminiLink from "./JiminiLink.ts";

type PreformattedTextCallback = (lines: string[]) => void;
type LinkCallback = (jiminiLink: JiminiLink) => void;
type Heading = {level: number, text: string};
type HeadingCallback = (heading: Heading) => void;
type ListItemCallback = (listItem: string) => void;
type QuotedTextCallback = (quotedText: string) => void;
type PlainTextCallback = (plainText: string) => void;
type ParseCallbacks = {
    preformattedText: PreformattedTextCallback,
    link: LinkCallback,
    heading: HeadingCallback,
    listItem: ListItemCallback,
    quotedText: QuotedTextCallback,
    plainText: PlainTextCallback
}

export interface SuccessResult {
    status: string,
    code: string,
    mime_type: string,
    body: number[],
}
export default class Success {
    code: string;
    body: number[];
    mimeType: GeminiMimeType;

    constructor(successResult: SuccessResult) {
        this.code = successResult.code;
        this.mimeType = GeminiMimeType.fromContentType(successResult.mime_type);
        this.body = successResult.body;
    }
    public parseGeminiDocument = (callbacks: ParseCallbacks) => {
        if (!this.isGemini()) return;

        let preformattedLines: string[] = [];
        let preformat: boolean = false;
        this.lines().forEach(line => {
            const geminiLine = GeminiLine.parseLine(line);
            if (geminiLine.type === LineType.PreformatToggle) {
                if (preformat) {
                    // End preformatted block
                    callbacks.preformattedText(preformattedLines);
                    preformattedLines = [];
                }
                preformat = !preformat;
            } else if (preformat) {
                // Add current line line to preformatted lines
                preformattedLines.push(line);
            } else switch (geminiLine.type) {
                case LineType.Link:
                    callbacks.link(JiminiLink.parseString(geminiLine.text ?? ""));
                    break;
                case LineType.Heading1:
                    callbacks.heading({level: 1, text: geminiLine.text ?? ""});
                    break;
                case LineType.Heading2:
                    callbacks.heading({level: 2, text: geminiLine.text ?? ""});
                    break;
                case LineType.Heading3:
                    callbacks.heading({level: 3, text: geminiLine.text ?? ""});
                    break;
                case LineType.ListItem:
                    callbacks.listItem(geminiLine.text ?? "");
                    break;
                case LineType.Quote:
                    callbacks.quotedText(geminiLine.text ?? "");
                    break;
                default:
                    callbacks.plainText(geminiLine.text ?? "");
            }
        })
    }
    public isTextLike = (): boolean => {
        return this.isText() || this.isXml();
    }
    public isXml = (): boolean => {
        return this.mimeType?.subtype === "xml";
    }
    public isText = (): boolean => {
        return this.mimeType?.type === "text";
    }
    public isGemini = (): boolean => {
        return this.isText() && this.mimeType?.subtype === "gemini";
    }
    public isImage = (): boolean => {
        return this.mimeType?.type === "image";
    }
    public text = (): string => {
        return Util.bin2String(this.body)
    }
    public lines = (): string[] => {
        return this.text().split(/\r?\n/);
    }
    public debug = (): string => {
        let s = `Success: {\n\tcode: ${this.code}\n`;
        s += `\tmime type: ${this.mimeType?.debug()}`
        s += this.isText() ? `\ttext: "${this.text()}"\n` : "\t** binary **\n";
        s += "\n}"
        return s;
    }
}
