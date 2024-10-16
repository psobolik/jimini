import Util from "../Util.ts";
import GeminiMimeType from "./GeminiMimeType.ts";

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
