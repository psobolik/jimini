export interface CertificateResult {
    status: string,
        code: string,
        message: string,
}
export default class Certificate {
    code: string;
    message: string;

    constructor(certificateResult: CertificateResult) {
        this.code = certificateResult.code;
        this.message = certificateResult.message;
    }

    toString = () => {
        return `${this.code} - ${this.message}`;
    }
}
