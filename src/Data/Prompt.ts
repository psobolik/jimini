export interface PromptResult {
    status: string,
    code: string,
    prompt: string,
}

export default class Prompt implements PromptResult {
    status: string;
    code: string;
    prompt: string;

    constructor(promptResult: PromptResult) {
        this.status = promptResult.status;
        this.code = promptResult.code;
        this.prompt = promptResult.prompt;
    }
    isSensitive = () => this.code == "11";
}