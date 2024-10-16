export interface RedirectResult {
    status: string,
    code: string,
    url: string,
}
export default class Redirect implements RedirectResult {
    status: string;
    code: string;
    url: string;
    constructor(redirectResult: RedirectResult) {
        this.status = redirectResult.status;
        this.code = redirectResult.code;
        this.url = redirectResult.url;
    }
    isPermanent = () => this.code == "31";
}