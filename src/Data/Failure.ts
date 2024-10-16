export interface FailureResult {
    status: string,
    code: string,
    message: string,
}
export default class Failure {
    code: string;
    message: string;

    constructor(failureResult: FailureResult) {
        this.code = failureResult.code;
        this.message = failureResult.message;
    }
    isPermanent = () => this.code.startsWith("5");

    toString = () => {
        return `${this.code} - ${this.message}`;
    }
}
