import {SuccessResult} from "./Success.ts";
import {FailureResult} from "./Failure.ts";
import {PromptResult} from "./Prompt.ts";
import {RedirectResult} from "./Redirect.ts";
import {CertificateResult} from "./Certificate.ts";

export default interface GeminiResponse {
    tag: string,
    prompt: PromptResult | undefined;
    redirect: RedirectResult | undefined;
    success: SuccessResult | undefined;
    failure: FailureResult | undefined;
    certificate: CertificateResult | undefined;
}
